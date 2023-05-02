import { OrderStatusEnum } from "@arvtickets/common";
import mongoose, { Schema, model } from "mongoose";
import { IOrder, IOrderModel, IOrderDocument } from "./interfaces/order-interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: Object.values(OrderStatusEnum),
		default: OrderStatusEnum.CREATED,
		required: true
	},
	expiresAt: {
		type: mongoose.Schema.Types.Date,
		required: false
	},
	ticket: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Ticket'
	}
},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			}
		}
	}
);


orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (order: IOrder) => {
	return new Order(order);
}

const Order = model<IOrderDocument, IOrderModel>('Order', orderSchema);

export { Order };