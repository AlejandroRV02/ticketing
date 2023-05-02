import { Model, Document } from "mongoose";

interface IPayment {
	orderId: string;
	stripeId: string;
}

interface IPaymentDocument extends Document {
	orderId: string;
	stripeId: string;
}

interface IPaymentModel extends Model<IPaymentDocument> {
	build(payment: IPayment): IPaymentDocument
}

export { IPayment, IPaymentDocument, IPaymentModel }