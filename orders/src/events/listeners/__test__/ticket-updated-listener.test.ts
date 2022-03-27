import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {TicketCreatedEvent, TicketUpdatedEvent} from "@tbarous/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";
import {TicketUpdatedListener} from "../ticket-updated-listener";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 20
    });

    await ticket.save();

    const data: TicketUpdatedEvent["data"] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: "new concert",
        price: 1000,
        userId: "dqwd"
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {msg, data, ticket, listener};
}

it("finds, updates and saves a ticket", async () => {
    const {listener, data, message} = await setup();

    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
    const {listener, data, message} = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
})