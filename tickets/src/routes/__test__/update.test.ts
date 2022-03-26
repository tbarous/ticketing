import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {getCookie} from "../../test/auth-helper";

it("Returns 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", getCookie())
        .send({
            title: "dqwdqw",
            price: 20
        })
        .expect(404);
});

it("Returns 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "dqwdqw",
            price: 20
        })
        .expect(401);
});

it("Returns 401 if the user does not own the ticket", async () => {

});

it("Returns 400 if the user provides an invalid title or price", async () => {

});

it("Updates the ticket provided valid inputs", async () => {

});