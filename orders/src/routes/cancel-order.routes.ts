import { NotFoundError, OrderStatusEnum, requireAuth } from "@arvtickets/common";
import { Router, Request, Response } from "express";
import { Order } from "../models/Order";
import { natsWrapper } from "../nats/nats.wrapper";
import { OrderCancelledPublisher } from "../nats/publishers/order-cancelled.publisher";

const router = Router();

router.put('/:id', requireAuth, async (req: Request, res: Response) => {

	const { id } = req.params;

	const order = await Order.findOne({ id, userId: req.currentUser.id }).populate('ticket');

	if (!order) throw new NotFoundError();

	order.status = OrderStatusEnum.CANCELLED;

	await order.save();

	new OrderCancelledPublisher(natsWrapper.client).publish({
		id: order.id,
		version: order.version,
		ticket: {
			id: order.ticket.id
		}
	})

	res.status(200).json({ order });
});

export { router as cancelOrderRouter }