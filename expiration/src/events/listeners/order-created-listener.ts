import {Listener, OrderCreatedEvent, Subjects} from "@tbarous/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], message: Message) {
    }

    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}