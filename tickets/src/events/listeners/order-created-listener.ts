import {Listener, OrderCreatedEvent, Subjects} from "@tbarous/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], message: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        ticket.set({orderId: data.id});

        await ticket.save();

        message.ack();
    }

    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}