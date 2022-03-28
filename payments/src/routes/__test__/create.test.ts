import request from "supertest";
import {app} from "../../app";
import {getCookie} from "../../test/auth-helper";
import mongoose from "mongoose";
import {Order} from "../../models/order";
import {OrderStatus} from "@tbarous/common";

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

})