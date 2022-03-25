import request from "supertest";
import {app} from "../../app";

it("Clears the cookie after signing out", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "12345"
        })
        .expect(201);

    const response = await request(app)
        .post("/api/users/signout")
        .send({})
        .expect(200);

    console.log(response.get("Set-Cookie"));
});