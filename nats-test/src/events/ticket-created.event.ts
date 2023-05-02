import { Subjects } from "../enums/subjects.enum";

export interface TicketCreatedEvent {
	subject: Subjects.TICKET_CREATED;
	data: {
		id: string;
		title: string;
		price: number;
	}
}