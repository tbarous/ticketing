import {Subjects} from "./subjects";
import {OrderStatus} from "./types/order-status";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated,
    data: {
        ticket: {
            id: string,
            price: number
        },
        userId: string,
        price: number,
        expiresAt: string
        status: OrderStatus
    }
}