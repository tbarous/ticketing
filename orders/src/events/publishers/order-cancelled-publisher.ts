import {OrderCancelledEvent, OrderCreatedEvent, Publisher, Subjects} from "@tbarous/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}