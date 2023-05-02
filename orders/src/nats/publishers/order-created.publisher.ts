import { OrderCreatedEvent, Publisher, Subjects } from "@arvtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
}
