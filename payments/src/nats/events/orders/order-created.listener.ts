import { Listener, OrderCreatedEvent, OrderStatusEnum, Subjects } from "@arvtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/Order";
import { queueGroupName } from "../../constants";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const order = Order.build({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version
		})

		await order.save();

		msg.ack();
	}

}