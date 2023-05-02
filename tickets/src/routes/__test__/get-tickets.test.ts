import request from "supertest";
import { app } from "../../app";

it('returns a list of tickets', async () => {
	const cookie = global.signin();
	await createTicket(cookie);
	await createTicket(cookie);
	await createTicket(cookie);

	const response = await request(app)
		.get("/api/tickets")
		.set('Cookie', cookie)
		.send()
		.expect(200);

	expect(response.body.length).toEqual(3);
});

const createTicket = (cookie: any) => {
	return request(app)
		.post("/api/tickets")
		.set('Cookie', cookie)
		.send({
			title: "Title",
			price: 123
		});
}