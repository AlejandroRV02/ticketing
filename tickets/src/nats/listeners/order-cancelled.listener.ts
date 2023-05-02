import { Listener, OrderCancelledEvent, Subjects } from "@arvtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "../constants";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) throw new Error();

		ticket.set({ orderId: undefined });

		await ticket.save();

		await new TicketUpdatedPublisher(this.client).publish(ticket.toJSON());

		msg.ack();
	}

}