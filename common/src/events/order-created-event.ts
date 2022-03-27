import {Subjects} from "./subjects";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated,
    data: {
        ticketId: string,
        userId: string,
        price: number,
        expiresAt: Date,
        orderId: string
    }
}