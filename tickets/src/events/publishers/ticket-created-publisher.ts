import {Publisher, Subjects, TicketCreatedEvent} from "@tbarous/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}