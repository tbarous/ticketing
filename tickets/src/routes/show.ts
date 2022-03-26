import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@tbarous/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";

const router = express.Router();

router.post(
    "/api/tickets/:id",
    [
        body("id")
            .not()
            .isEmpty()
            .withMessage("Title is required")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        res.send(ticket);
    }
);

export {router as showTicketRouter};