import {ExpirationCompleteEvent, Publisher, Subjects} from "@tbarous/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}