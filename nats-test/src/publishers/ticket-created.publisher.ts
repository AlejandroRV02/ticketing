import { Subjects } from "../enums/subjects.enum";
import { TicketCreatedEvent } from "../events/ticket-created.event";
import { Publisher } from "../publisher.abstract";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}