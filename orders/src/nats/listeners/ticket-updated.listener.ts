import { Listener, Subjects, TicketUpdatedEvent } from "@arvtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "../constants";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
		const ticket = await Ticket.findByEvent(data);

		if (!ticket) throw new Error("Ticket not found");

		const { title, price } = data;

		ticket.set({ title, price });

		await ticket.save();

		msg.ack();
	}

}