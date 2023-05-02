import { BadRequestError, NotFoundError, OrderStatusEnum, requireAuth, validateRequest } from "@arvtickets/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";
import { OrderCreatedPublisher } from "../nats/publishers/order-created.publisher";
import { natsWrapper } from "../nats/nats.wrapper";

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/', requireAuth,
	[
		body('ticketId')
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Ticket ID must be provided")
	]
	, validateRequest,
	async (req: Request, res: Response) => {

		const { ticketId } = req.body;

		// TODO: Find the ticket the user wants to buy
		const existingTicket = await Ticket.findById(ticketId);

		if (!existingTicket) throw new NotFoundError();

		// TODO: Make sure the ticket is not already reserved
		const ticketReserved = await existingTicket.isReserved();

		if (ticketReserved) throw new BadRequestError("Ticket reserved");

		// TODO: Calculate an exp date
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

		// TODO: Build the order and save it
		const order = Order.build({
			userId: req.currentUser.id,
			status: OrderStatusEnum.CREATED,
			expiresAt: expiration,
			ticket: existingTicket
		})

		await order.save();

		// TODO: Publish an event order:created
		new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			status: order.status,
			userId: order.userId,
			expiresAt: order.expiresAt.toISOString(),
			version: order.version,
			ticket: {
				id: existingTicket.id,
				price: existingTicket.price,
			}
		})

		res.status(201).json({ order })

	});

export { router as createOrderRouter }