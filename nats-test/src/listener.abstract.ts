import { Message, Stan } from "node-nats-streaming";
import { Event } from "./events/event.interface";

export abstract class Listener<T extends Event> {

	abstract subject: T['subject'];
	abstract queueGroupName: string;

	private client: Stan;

	protected ackWait = 5 * 1000;

	constructor(client: Stan) {
		this.client = client;
	}

	abstract onMessage(data: T['data'], msg: Message): void

	suscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName);
	}

	listen() {
		const suscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.suscriptionOptions()
		)

		suscription.on('message', (msg: Message) => {

			console.log(
				`Message received: ${this.subject} / ${this.queueGroupName}`
			)

			const parsedData = this.parseMessage(msg);

			this.onMessage(parsedData, msg)

		})
	}

	parseMessage(message: Message) {
		const data = message.getData();

		return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
	}
}
