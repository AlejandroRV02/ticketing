import { NotFoundError, requireAuth } from "@arvtickets/common";
import { Router, Request, Response } from "express";
import { Order } from "../models/Order";

const router = Router();

router.get('/:id', requireAuth, async (req: Request, res: Response) => {

	const order = await Order.findOne({ id: req.params.id, userId: req.currentUser.id }).populate('ticket');

	if (!order) throw new NotFoundError();

	res.status(200).json({ order });
});

export { router as getOrderByIdRouter }