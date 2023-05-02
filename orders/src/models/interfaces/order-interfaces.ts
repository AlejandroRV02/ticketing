import { OrderStatusEnum } from "@arvtickets/common";
import { Model, Document } from "mongoose"
import { ITicketDocument } from "./ticket-interfaces";

interface IOrder {
	userId: string;
	status: OrderStatusEnum;
	expiresAt: Date;
	ticket: ITicketDocument;
}

interface IOrderDocument extends Document {
	userId: string;
	status: OrderStatusEnum;
	expiresAt: Date;
	ticket: ITicketDocument;
	version: number;
}

interface IOrderModel extends Model<IOrderDocument> {
	build(order: IOrder): IOrderDocument;
}

export { IOrder, IOrderModel, IOrderDocument }