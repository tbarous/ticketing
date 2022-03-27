import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {getCookie} from "../../test/auth-helper";

it("Returns an error if the ticket does not exist", async () => {
    const ticketId = mongoose.Types.ObjectId();

    request(app)
        .post("/api/orders")
        .set("Cookie", getCookie())
        .send({ticketId})
        .expect(404);
});

it("Returns an error if the ticket is already reserved", async () => {

});

it("Reserves a ticket", async () => {

});