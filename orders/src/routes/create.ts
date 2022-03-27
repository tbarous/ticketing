import express, {Request, Response} from "express";
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from "@tbarous/common";
import {body} from "express-validator";
import mongoose from "mongoose";
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";

const router = express.Router();

router.post(
    "/api/orders",
    requireAuth,
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("TicketId must be provided")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // Find the ticket the user is trying to order in the database
        const {ticketId} = req.body;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure that this ticket is not already reserved
        // Run query to look at all orders and find an order where the ticket we found
        // and the order's status is not cancelled. If we find an order, the ticket is reserved
        const isReserved = await ticket.isReserved();

        if (isReserved) {
            throw new BadRequestError("Ticket is already reserved");
        }

        // Calculate an expiration date for this order

        // Build the order and save it to the database

        // Publish an event saying that an order was created

    }
);

export {router as createOrderRouter}