import { Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ITicket, ITicketModel, ITicketDocument } from "./interfaces/ticket-interfaces";

const ticketSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	orderId: {
		type: String
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
	return new Ticket(ticket);
}

const Ticket = model<ITicketDocument, ITicketModel>('Ticket', ticketSchema);

export { Ticket };