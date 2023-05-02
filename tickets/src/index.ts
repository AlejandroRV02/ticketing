import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats/nats.wrapper';
import { randomBytes } from "crypto";
import { OrderCreatedListener } from './nats/listeners/order-created.listener';
import { OrderCancelledListener } from './nats/listeners/order-cancelled.listener';

const start = async () => {

	if (!process.env.JWT_KEY) throw new Error('JWT_KEY secret must be defined');
	if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI secret must be defined');
	if (!process.env.NATS_URL) throw new Error('NATS_URL secret must be defined');
	if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID secret must be defined');
	if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID secret must be defined');

	const url = process.env.NATS_URL;
	const clusterId = process.env.NATS_CLUSTER_ID;
	const clientId = process.env.NATS_CLIENT_ID;

	const mongoURI = process.env.MONGODB_URI;

	try {
		await natsWrapper.connect(clusterId, clientId, url);

		natsWrapper.client.on('close', () => {
			console.log('NATS connection closing')
			process.exit()
		})

		process.on('SIGINT', () => natsWrapper.client.close())
		process.on('SIGTERM', () => natsWrapper.client.close())

		new OrderCreatedListener(natsWrapper.client).listen();
		new OrderCancelledListener(natsWrapper.client).listen();

		await mongoose.connect(mongoURI);

	} catch (error) {

	}

	app.listen(3000, () => {
		console.log('Tickets: Listening in 3000!')
	});

}

start();