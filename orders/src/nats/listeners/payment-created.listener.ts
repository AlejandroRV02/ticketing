import { Listener, NotFoundError, OrderStatusEnum, PaymentCreatedEvent, Subjects } from "@arvtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "../constants";
import { Order } from "../../models/Order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	subject: Subjects.PAYMENT_CREATED = Subjects.PAYMENT_CREATED;
	queueGroupName: string = queueGroupName;

	async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
		const order = await Order.findById(data.orderId);

		if (!order) throw new NotFoundError();

		order.set({ status: OrderStatusEnum.COMPLETE })

		await order.save();

		msg.ack();
	}

}