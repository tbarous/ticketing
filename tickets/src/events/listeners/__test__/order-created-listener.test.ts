import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@tbarous/common";
import mongoose from "mongoose";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: "Concert",
        price: 99,
        userId: "dqwdqw"
    });

    await ticket.save();

    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        },
        userId: "dqwdqw",
        expiresAt: "dwqdqw",
        status: OrderStatus.Created,
        version: 0
    };
}