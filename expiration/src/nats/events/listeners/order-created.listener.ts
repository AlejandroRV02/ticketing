import { Listener } from "@arvtickets/common";
import { OrderCreatedEvent } from "@arvtickets/common";
import { Subjects } from "@arvtickets/common/build/nats/subjects.enum";
import { Message } from "node-nats-streaming";
import { natsQueueGroupName } from "../../../constants";
import { expirationQueue } from "../../../queues/expiration.queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
	queueGroupName = natsQueueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

		await expirationQueue.add(
			{
				orderId: data.id
			},
			{
				delay
			}
		);

		msg.ack();
	}

}