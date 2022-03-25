import request from "supertest";
import {app} from "../../app";
import {signup} from "../../test/auth-helper";

it("Responds with details about the current user", async () => {
    const cookie = await signup();

    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
});