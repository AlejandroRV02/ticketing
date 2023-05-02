import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest, } from "@arvtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { natsWrapper } from "../nats/nats.wrapper";
import { TicketUpdatedPublisher } from "../nats/publishers/ticket-updated.publisher";

const router = express.Router();

router.put("/:id",
	requireAuth,
	[
		body('title')
			.isString()
			.not()
			.isEmpty()
			.withMessage("Title must be provided"),

		body('price')
			.isFloat({ gt: 0 })
			.withMessage("Price must be greater than 0")
			.not()
			.isEmpty()
			.withMessage("Price must be provided")
	],
	validateRequest,
	async (req: Request, res: Response) => {

		const { id } = req.params;

		const existingTicket = await Ticket.findById(id);

		if (!existingTicket) throw new NotFoundError();

		if (existingTicket.userId !== req.currentUser.id) throw new NotAuthorizedError();

		if (existingTicket.orderId) throw new BadRequestError("Ticket reserved");

		existingTicket.set({
			title: req.body.title,
			price: req.body.price
		});

		await existingTicket.save();

		new TicketUpdatedPublisher(natsWrapper.client).publish(existingTicket.toJSON())

		return res.status(200).json(existingTicket);
	})

export { router as updateTicketRouter }