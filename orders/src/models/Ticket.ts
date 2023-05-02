import { OrderStatusEnum } from "@arvtickets/common";
import { Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ITicket, ITicketModel, ITicketDocument } from "./interfaces/ticket-interfaces";
import { Order } from "./Order";

const ticketSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true,
		min: 0
	},
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (ticket: ITicket) => {
	return new Ticket({
		_id: ticket.id,
		title: ticket.title,
		price: ticket.price
	});
}

ticketSchema.statics.findByEvent = (data: { id: string, version: number }) => {
	return Ticket.findOne({ _id: data.id, version: data.version - 1 });
}

ticketSchema.methods.isReserved = async function () {
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatusEnum.CREATED,
				OrderStatusEnum.AWAITING_PAYMENT,
				OrderStatusEnum.COMPLETE,
			]
		}
	})

	return !!existingOrder;
}

const Ticket = model<ITicketDocument, ITicketModel>('Ticket', ticketSchema);

export { Ticket };