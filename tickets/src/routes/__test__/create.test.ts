import request from "supertest";
import {app} from "../../app";
import {getCookie} from "../../test/auth-helper";

it("Has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({});

    expect(response.status).not.toEqual(404);
});

it("Can only be accessed if the user is signed in", async () => {
    await request(app)
        .post("/api/tickets")
        .send({})
        .expect(401);
});

it("Returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", getCookie())
        .send({});

    expect(response.status).not.toEqual(401);
});

it("It returns an error if an invalid title is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", getCookie())
        .send({
            title: "",
            price: "10"
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", getCookie())
        .send({
            price: "10"
        })
        .expect(400);
});

it("It returns an error if an invalid price is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", getCookie())
        .send({
            title: "Title",
            price: -10
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", getCookie())
        .send({
            title: "Title"
        })
        .expect(400);
});

it("It creates a ticket with valid inputs", async () => {
    // Add in a check to make sure a ticket was added to db

    await request(app)
        .post("/api/tickets")
        .send({
            title: "Title 1",
            price: 20
        })
        .expect(201);
});