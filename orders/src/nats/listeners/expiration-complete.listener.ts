import { Listener, ExpirationCompleteEvent, Subjects, OrderStatusEnum } from "@arvtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/Order";
import { queueGroupName } from "../constants";
import { OrderCancelledPublisher } from "../publishers/order-cancelled.publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	subject: Subjects.EXPIRATION_COMPLETE = Subjects.EXPIRATION_COMPLETE;
	queueGroupName = queueGroupName;

	async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
		const order = await Order.findById(data.orderId).populate('ticket');

		if (!order) throw new Error();

		if (order.status === OrderStatusEnum.COMPLETE) {
			return msg.ack();
		}

		order.set({ status: OrderStatusEnum.CANCELLED });

		await order.save();

		await new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			version: order.version,
			ticket: {
				id: order.ticket.id
			}
		})

		msg.ack();
	}

}
