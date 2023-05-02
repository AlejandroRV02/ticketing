import { Schema, model } from "mongoose";
import { IPayment, IPaymentDocument, IPaymentModel } from "./interfaces/payment.interface";

const paymentSchema = new Schema({
	orderId: {
		required: true,
		type: String
	},
	stripeId: {
		required: true,
		type: String
	}
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = doc._id;
			delete ret._id;
		}
	}
});

paymentSchema.statics.build = (payment: IPayment) => {
	return new Payment(payment);
}

const Payment = model<IPaymentDocument, IPaymentModel>('Payment', paymentSchema);

export { Payment }