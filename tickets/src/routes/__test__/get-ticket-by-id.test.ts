import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it('returns 404 if ticket with id provided is not found', async () => {
	await request(app)
		.get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
		.set('Cookie', global.signin())
		.send()
		.expect(404)
});

it('returns 200 when the id provided exists', async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set('Cookie', global.signin())
		.send({ title: "Title", price: 123 })
		.expect(201)

	await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send()
		.expect(200)
});

