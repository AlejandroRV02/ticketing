import { OrderStatusEnum } from "@arvtickets/common";
import { Schema, model } from "mongoose";
import { IOrder, IOrderDocument, IOrderModel } from "./interfaces/order.interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: Object.values(OrderStatusEnum),
		required: true
	},
	price: {
		type: Number,
		required: true
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
	return new Order({
		_id: order.id,
		version: order.version,
		price: order.price,
		status: order.status
	});
}

const Order = model<IOrderDocument, IOrderModel>('Order', orderSchema);

export { Order };