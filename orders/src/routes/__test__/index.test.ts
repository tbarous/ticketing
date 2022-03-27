import {Ticket} from "../../models/ticket";
import {getCookie} from "../../test/auth-helper";
import request from "supertest";
import {app} from "../../app";

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20
    });

    await ticket.save();

    return ticket;
}

it("fetches orders for a particular user", async () => {
    // Create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = getCookie();
    const userTwo = getCookie()

    // Create one order as user #1
    await request(app)
        .post("/api/orders")
        .set("Cookie", userOne)
        .send({
            ticketId: ticketOne.id
        })
        .expect(201);

    // Create two orders as user #2
    await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({
            ticketId: ticketTwo.id
        })
        .expect(201);

    await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({
            ticketId: ticketThree.id
        })
        .expect(201);

    const response = await request(app)
        .get("/api/orders")
        .set("Cookie", userTwo)
        .expect(200);
})