import express, {Request, Response} from "express";
import {currentUser, requireAuth, validateRequest} from "@tbarous/common";
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
        const {title, price} = req.body;

        const ticket = Ticket.build({title, price, userId: req.currentUser!.id});

        await ticket.save();

        res.status(201).send(ticket);
    }
);

export {router as createTicketRouter};