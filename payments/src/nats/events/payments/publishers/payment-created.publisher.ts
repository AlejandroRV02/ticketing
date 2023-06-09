import { Publisher, PaymentCreatedEvent, Subjects } from "@arvtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PAYMENT_CREATED = Subjects.PAYMENT_CREATED;
}