import request from "supertest";
import {app} from "../app";
import jwt from "jsonwebtoken";

export const signup = async () => {
    // Build a JWT payload. {id, email}
    const payload = {
        id: "dqwdwq",
        email: "test@test.com"
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object. {jwt: TOKEN}
    const session = {jwt: token};

    // Turn that session to JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // Return a string that is the cookie with the encoded data
    return `session: ${base64}`;
}