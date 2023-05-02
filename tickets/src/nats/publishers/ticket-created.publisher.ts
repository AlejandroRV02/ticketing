import { Subjects, TicketCreatedEvent } from "@arvtickets/common";
import { Publisher } from "@arvtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}