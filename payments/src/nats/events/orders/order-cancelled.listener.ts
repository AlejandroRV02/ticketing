import { Listener, OrderCancelledEvent, OrderCreatedEvent, OrderStatusEnum, Subjects } from "@arvtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/Order";
import { queueGroupName } from "../../constants";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		const order = await Order.findOne({ _id: data.id, version: data.version - 1 });

		if (!order) throw new Error();

		order.set({ status: OrderStatusEnum.CANCELLED })

		await order.save();

		msg.ack();
	}

}