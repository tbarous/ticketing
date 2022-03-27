import {Listener, Subjects, TicketUpdatedEvent} from "@tbarous/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

    async onMessage(data: TicketUpdatedEvent["data"], message: Message): Promise<void> {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        const {title, price} = data;

        ticket.set({title, price});

        await ticket.save();

        message.ack();
    }
}