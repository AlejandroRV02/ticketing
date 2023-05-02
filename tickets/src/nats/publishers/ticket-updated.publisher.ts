import { Subjects, TicketUpdatedEvent } from "@arvtickets/common";
import { Publisher } from "@arvtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
}