import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {getCookie} from "../../test/auth-helper";
import {Ticket} from "../../models/ticket";
import {Order, OrderStatus} from "../../models/order";
import {natsWrapper} from "../../nats-wrapper";

it("Returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId()

    await request(app)
        .post("/api/orders")
        .set("Cookie", getCookie())
        .send({ticketId})
        .expect(404);
});

it("Returns an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    const order = Order.build({
        ticket,
        userId: "dwqdwq",
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", getCookie())
        .send({
            ticketId: ticket.id
        })
        .expect(400);
});

it("Reserves a ticket", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", getCookie())
        .send({
            ticketId: ticket.id
        })
        .expect(201);
});

it("Emits a created event", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", getCookie())
        .send({ticketId: ticket.id})
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})