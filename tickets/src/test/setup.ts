import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
	var signin: () => string[]
}

let mongo: any;

beforeAll(async () => {
	process.env.JWT_KEY = 'thisisgonnawork';

	mongo = await MongoMemoryServer.create();
	const mongoURI = mongo.getUri();

	await mongoose.connect(mongoURI, {})
})

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	if (mongo) await mongo.stop()
	await mongoose.connection.close()
});

global.signin = () => {

	const payload = { id: new mongoose.Types.ObjectId().toHexString(), email: "test@test.com" }

	const token = jwt.sign(payload, process.env.JWT_KEY!);

	const session = { jwt: token };

	const sessionJSON = JSON.stringify(session);

	const base64 = Buffer.from(sessionJSON).toString('base64');

	console.log(`session=${base64}`)

	return [`session=${base64}`];
}