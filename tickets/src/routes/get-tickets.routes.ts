import { requireAuth } from "@arvtickets/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get("/",
	requireAuth,
	async (req: Request, res: Response) => {

		const { currentUser } = req;

		const tickets = await Ticket.find({ userId: currentUser.id });

		return res.status(200).json(tickets);
	})

export { router as getTicketsRouter }