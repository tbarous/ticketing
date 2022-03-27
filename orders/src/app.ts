import express from "express";
import "express-async-errors";
import {json} from "body-parser";
import cookieSession from "cookie-session";
import {errorHandler, NotFoundError, currentUser} from "@tbarous/common";
import {createOrderRouter} from "./routes/create";
import {showOrderRouter} from "./routes/show";
import {showOrdersRouter} from "./routes/index";
import {deleteOrderRouter} from "./routes/delete";

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

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(showOrdersRouter);
app.use(deleteOrderRouter);

app.all("*", async (req: express.Request, res: express.Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export {app}