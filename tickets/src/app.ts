import express from "express";
import "express-async-errors";
import {json} from "body-parser";
import cookieSession from "cookie-session";
import {errorHandler, NotFoundError, currentUser} from "@tbarous/common";
import {createTicketRouter} from "./routes/create";
import {showTicketRouter} from "./routes/show";
import {showTicketsRouter} from "./routes";
import {updateTicketRouter} from "./routes/update";

const app = express();

app.set("trust proxy", true);

app.use(json());

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test"
    })
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketsRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req: express.Request, res: express.Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export {app}