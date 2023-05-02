import { Router, Request, Response } from "express";
import { requireAuth } from "@arvtickets/common";
import { Order } from "../models/Order";

const router = Router();

router.get('/',
	requireAuth,
	async (req: Request, res: Response) => {

		const orders = await Order.find({ userId: req.currentUser.id }).populate('ticket');

		res.status(200).json({ orders })
	});

export { router as getOrdersRouter }