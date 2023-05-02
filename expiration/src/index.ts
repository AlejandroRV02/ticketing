import { OrderCreatedListener } from './nats/events/listeners/order-created.listener';
import { natsWrapper } from './nats/nats.wrapper';


const start = async () => {

	if (!process.env.NATS_URL) throw new Error('NATS_URL secret must be defined');
	if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID secret must be defined');
	if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID secret must be defined');

	const url = process.env.NATS_URL;
	const clusterId = process.env.NATS_CLUSTER_ID;
	const clientId = process.env.NATS_CLIENT_ID;

	try {
		await natsWrapper.connect(clusterId, clientId, url);

		natsWrapper.client.on('close', () => {
			console.log('NATS connection closing')
			process.exit()
		})

		process.on('SIGINT', () => natsWrapper.client.close())
		process.on('SIGTERM', () => natsWrapper.client.close())

		new OrderCreatedListener(natsWrapper.client).listen();

	} catch (error) {

	}

}

start();