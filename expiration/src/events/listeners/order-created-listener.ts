import {Listener, OrderCreatedEvent, Subjects} from "@tbarous/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], message: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        console.log(delay)

        await expirationQueue.add({
                orderId: data.id
            },
            {
                delay
            }
        );

        message.ack();
    }

    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}