import { Message } from "node-nats-streaming";
import { Subjects } from "../enums/subjects.enum";
import { TicketCreatedEvent } from "../events/ticket-created.event";
import { Listener } from "../listener.abstract";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
	queueGroupName: string = 'payments-service';

	onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
		console.log('Event data!', data)

		msg.ack()
	}

}