import {Subjects} from "./subjects";
import {OrderStatus} from "./types/order-status";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated,
    data: {
        id: string,
        ticket: {
            id: string,
            price: number
        },
        userId: string,
        expiresAt: string
        status: OrderStatus
    }
}