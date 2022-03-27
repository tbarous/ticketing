import {Ticket} from "../../models/ticket";
import {getCookie} from "../../test/auth-helper";
import request from "supertest";
import {app} from "../../app";
import {Order, OrderStatus} from "../../models/order";
import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    return ticket;
}

it("Marks an order as cancelled", async () => {
    const ticket = await buildTicket();

    const user = getCookie();

    const {body: order} = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ticketId: ticket.id})
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Emits a cancelled event", async () => {
    const ticket = await buildTicket();

    const user = getCookie();

    const {body: order} = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ticketId: ticket.id})
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});