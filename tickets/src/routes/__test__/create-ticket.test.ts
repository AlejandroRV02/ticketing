import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

it('has a route handler listening to /api/tickets for post request', async () => {
	const response = await request(app)
		.post("/api/tickets")
		.send({})

	expect(response.status).not.toEqual(404);
});

it('returns 401 if the user is not signed in', async () => {
	await request(app)
		.post("/api/tickets")
		.send({})
		.expect(401)
});

it('does not return 401 if the user is signed in', async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set('Cookie', global.signin())
		.send({})

	expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
	await request(app)
		.post("/api/tickets")
		.set('Cookie', global.signin())
		.send({ title: "", price: 123.12 })
		.expect(400);

	await request(app)
		.post("/api/tickets")
		.set('Cookie', global.signin())
		.send({ price: 123.12 })
		.expect(400);
});

it('returns an error if an invalid price is provided', async () => {
	await request(app)
		.post("/api/tickets")
		.set('Cookie', global.signin())
		.send({ title: "This is a valid title", price: 0 })
		.expect(400);

	await request(app)
		.post("/api/tickets")
		.set('Cookie', global.signin())
		.send({ title: "This is a valid title" })
		.expect(400);
});

it('creates a ticket if valid params are provided', async () => {

	let tickets = await Ticket.find({});

	expect(tickets.length).toEqual(0);

	await request(app)
		.post("/api/tickets")
		.set('Cookie', global.signin())
		.send({
			title: "Test Title",
			price: 123
		})
		.expect(201);

	tickets = await Ticket.find({});

	expect(tickets.length).toEqual(1);
});