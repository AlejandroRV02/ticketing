import { Listener, Subjects, TicketCreatedEvent } from "@arvtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "../constants";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
		const { id, title, price } = data;

		const ticket = Ticket.build({ id, title, price });

		await ticket.save();

		msg.ack()
	}

}