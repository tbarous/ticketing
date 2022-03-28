import {Listener, OrderCancelledEvent, OrderStatus, Subjects} from "@tbarous/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    async onMessage(data: OrderCancelledEvent["data"], message: Message) {
        const order = Order.findOne({
            _id: data.id,
            version: data.version - 1
        })

        if (!order) {
            throw new Error("Order not found")
        }

        order.set({status: OrderStatus.Cancelled});

        await order.save();

        message.ack();
    }

    queueGroupName = queueGroupName;
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}