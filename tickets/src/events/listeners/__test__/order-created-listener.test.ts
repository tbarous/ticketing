import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@tbarous/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

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

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, msg}
}

it("Sets the orderId of the ticket", async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it("Acks the message", async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it("Publishes a ticket updated event", async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId);
});