import { BadRequestError, NotAuthorizedError, OrderStatusEnum, requireAuth } from "@arvtickets/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/Order";
import { stripe } from "../stripe/stripe";
import { Payment } from "../models/Payment";
import { PaymentCreatedPublisher } from "../nats/events/payments/publishers/payment-created.publisher";
import { natsWrapper } from "../nats/nats.wrapper";

const router = Router();

router.post('/',
	requireAuth,
	[
		body('token')
			.not()
			.isEmpty(),
		body('orderId')
			.not()
			.isEmpty()
	],
	async (req: Request, res: Response) => {

		const { orderId, token } = req.body;

		const order = await Order.findById(orderId);

		if (!order) throw new Error();

		if (order.userId !== req.currentUser.id) throw new NotAuthorizedError();

		if (order.status === OrderStatusEnum.CANCELLED) throw new BadRequestError("Order Cancelled");

		const charge = await stripe.charges.create({
			currency: 'usd',
			amount: order.price * 100,
			source: token
		})

		const payment = Payment.build({ orderId, stripeId: charge.id })

		await payment.save();

		new PaymentCreatedPublisher(natsWrapper.client).publish({
			id: payment.id,
			orderId: payment.orderId,
			stripeId: payment.stripeId
		})

		res.status(201).json({ payment })

	}
);

export { router as createChargeRouter }