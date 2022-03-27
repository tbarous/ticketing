import {OrderCreatedEvent, Publisher, Subjects} from "@tbarous/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}