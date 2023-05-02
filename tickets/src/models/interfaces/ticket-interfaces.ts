import { Model, Document } from "mongoose"

interface ITicket {
	title: string;
	price: number;
	userId: string;
}

interface ITicketDocument extends Document {
	title: string;
	price: number;
	userId: string;
	version: number;
	orderId?: string;
}

interface ITicketModel extends Model<ITicketDocument> {
	build(ticket: ITicket): ITicketDocument;
}


export { ITicket, ITicketModel, ITicketDocument }