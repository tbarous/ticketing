import request from "supertest";
import {app} from "../../app";
import {getCookie} from "../../test/auth-helper";
import mongoose from "mongoose";
import {Order} from "../../models/order";
import {OrderStatus} from "@tbarous/common";
import {stripe} from "../../stripe";

jest.mock("./../../stripe");

it("returns 404 on non existing order", async () => {
    await request(app)
        .post("/api/payments")
        .set("Cookie", getCookie())
        .send({
            token: "dqwdqw",
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
})

it("returns 401 on order non belonging to user", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", getCookie())
        .send({
            token: "dqwdqw",
            orderId: order.id
        })
        .expect(401);
})

it("returns 400 on cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: userId,
        price: 20,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", getCookie(userId))
        .send({
            token: "dqwdqw",
            orderId: order.id
        })
        .expect(400);
});

it("returns 204 with valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: userId,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", getCookie())
        .send({
            token: "tok_visa",
            orderId: order.id
        })
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual("tok_visa");
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual("usd");
});