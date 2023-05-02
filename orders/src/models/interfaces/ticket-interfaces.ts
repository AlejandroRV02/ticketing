import { Model, Document } from "mongoose"

interface ITicket {
	id: string;
	title: string;
	price: number;
}

interface ITicketDocument extends Document {
	title: string;
	price: number;
	version: number;
	isReserved(): Promise<boolean>;
}

interface ITicketModel extends Model<ITicketDocument> {
	build(ticket: ITicket): ITicketDocument;
	findByEvent(event: { id: string, version: number }): Promise<ITicketDocument | null>;
}


export { ITicket, ITicketModel, ITicketDocument }