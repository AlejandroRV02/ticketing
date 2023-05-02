import { OrderStatusEnum } from "@arvtickets/common";
import { Model, Document } from "mongoose";

interface IOrder {
	id: string;
	status: OrderStatusEnum;
	version: number;
	price: number;
	userId: string;
}

interface IOrderDocument extends Document {
	status: OrderStatusEnum;
	version: number;
	price: number;
	userId: string;
}

interface IOrderModel extends Model<IOrderDocument> {
	build(order: IOrder): IOrderDocument;
}

export { IOrder, IOrderModel, IOrderDocument }