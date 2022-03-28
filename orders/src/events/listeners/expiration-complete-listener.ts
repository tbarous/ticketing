import {ExpirationCompleteEvent, Listener, Subjects} from "@tbarous/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Order, OrderStatus} from "../../models/order";
import {OrderCancelledPublisher} from "../publishers/order-cancelled-publisher";
import {natsWrapper} from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    async onMessage(data: ExpirationCompleteEvent["data"], message: Message) {
        const order = await Order.findById(data.orderId).populate("ticket");

        if (!order) {
            throw new Error("Order not found");
        }

        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            ticket: {id: order.ticket.id},
            version: order.version
        });

        msg.ack();
    }

    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}