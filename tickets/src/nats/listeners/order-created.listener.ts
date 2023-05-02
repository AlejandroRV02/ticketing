import { Listener, OrderCreatedEvent, Subjects } from "@arvtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "../constants";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) throw new Error();

		ticket.set({ orderId: data.id });

		await ticket.save();

		await new TicketUpdatedPublisher(this.client).publish(ticket.toJSON());


		msg.ack();
	}

}