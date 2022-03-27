import {Listener, Subjects, TicketCreatedEvent} from "@tbarous/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

    async onMessage(data: TicketCreatedEvent["data"], message: Message): Promise<void> {
        const {title, price} = data;

        const ticket = Ticket.build({
            title, price
        });

        await ticket.save();

        message.ack();
    }
}