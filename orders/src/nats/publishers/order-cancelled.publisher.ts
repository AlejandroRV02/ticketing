import { OrderCancelledEvent, Publisher, Subjects } from "@arvtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;

}
