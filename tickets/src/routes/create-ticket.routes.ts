import { requireAuth, validateRequest } from "@arvtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { TicketCreatedPublisher } from "../nats/publishers/ticket-created.publisher";
import { natsWrapper } from "../nats/nats.wrapper";

const router = express.Router();

router.post("/",
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

		const { title, price } = req.body;

		const ticket = Ticket.build({ title, price, userId: req.currentUser.id });

		await ticket.save();

		new TicketCreatedPublisher(natsWrapper.client).publish(ticket.toJSON())

		return res.status(201).json(ticket);
	})

export { router as createTicketRouter }