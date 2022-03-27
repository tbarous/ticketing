import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {getCookie} from "../../test/auth-helper";
import {Ticket} from "../../models/ticket";
import {Order, OrderStatus} from "../../models/order";

it("Returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId()

    request(app)
        .post("/api/orders")
        .set("Cookie", getCookie())
        .send({ticketId})
        .expect(404);
});

it("Returns an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        ticket,
        userId: "dwqdwq",
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    request(app)
        .post("/api/orders")
        .set("Cookie", getCookie())
        .send({
            ticketId: ticket.id
        })
        .expect(400);
});

it("Reserves a ticket", async () => {

});