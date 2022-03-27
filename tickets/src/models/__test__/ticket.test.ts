import {Ticket} from "../ticket";

it("Implements optimistic concurrency control", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 5,
        userId: "123"
    });

    await ticket.save();

    

})