import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {getCookie} from "../../test/auth-helper";

jest.mock("../../nats-wrapper");

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
    const response = await request(app)
        .post(`/api/tickets`)
        .set("Cookie", getCookie())
        .send({
            title: "dqwdqw",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", getCookie())
        .send({
            title: "dqwdqw",
            price: 20
        })
        .expect(401);
});

it("Returns 400 if the user provides an invalid title or price", async () => {
    const cookie = getCookie();

    const response = await request(app)
        .post(`/api/tickets`)
        .set("Cookie", cookie)
        .send({
            title: "dqwdqw",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 20
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "Concert",
            price: -20
        })
        .expect(400);
});

it("Updates the ticket provided valid inputs", async () => {
    const cookie = getCookie();

    const response = await request(app)
        .post(`/api/tickets`)
        .set("Cookie", cookie)
        .send({
            title: "Concert 1",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "Concert 2",
            price: 50
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual("Concert 2");
    expect(ticketResponse.body.price).toEqual(50);
});