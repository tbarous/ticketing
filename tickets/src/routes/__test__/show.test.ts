import request from "supertest";
import {app} from "../../app";
import {getCookie} from "../../test/auth-helper";

it("Returns a 404 if ticket is not found", async () => {
    const response = await request(app)
        .get("/api/tickets/dwqdqwdddddddddddddddddwqd")
        .send()
        .expect(404);

    console.log(response);
});

it("Returns the ticket if it is found", async () => {
    const title = "Concert"
    const price = 20;

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", getCookie())
        .send({title, price})
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});