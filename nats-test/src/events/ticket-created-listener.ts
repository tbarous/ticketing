import {Listener} from "./base-listener";
import {Message} from "node-nats-streaming";
import {TicketCreatedEvent} from "./ticket-created-event";
import {Subjects} from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    queueGroupName = "payments-service";
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;

    onMessage(data: TicketCreatedEvent["data"], message: Message): void {
        console.log("Event data!", data);

        message.ack();
    }
}