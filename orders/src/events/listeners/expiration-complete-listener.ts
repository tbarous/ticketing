import {ExpirationCompleteEvent, Listener, Subjects} from "@tbarous/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Order, OrderStatus} from "../../models/order";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    async onMessage(data: ExpirationCompleteEvent["data"], message: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();
    }

    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}