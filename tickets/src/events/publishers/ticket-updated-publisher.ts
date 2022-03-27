import {Publisher, Subjects, TicketUpdatedEvent} from "@tbarous/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}