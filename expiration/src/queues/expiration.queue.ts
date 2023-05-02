import Queue from "bull";
import { Payload } from "./payload.interface";
import { bullQueueName } from "../constants";
import { ExpirationCompletePublisher } from "../nats/events/publishers/expiration-complete.publisher";
import { natsWrapper } from "../nats/nats.wrapper";

const expirationQueue = new Queue<Payload>(bullQueueName, {
	redis: {
		host: process.env.REDIS_HOST
	}
})

expirationQueue.process(async (job) => {
	new ExpirationCompletePublisher(natsWrapper.client).publish({ orderId: job.data.orderId })
})

export { expirationQueue };
