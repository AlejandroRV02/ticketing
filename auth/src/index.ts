import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {

	if (!process.env.JWT_KEY) throw new Error('JWT_KEY secret must be defined');
	if (!process.env.MONGODB_URI) throw new Error('JWT_KEY secret must be defined');

	try {
		await mongoose.connect(process.env.MONGODB_URI);
	} catch (error) {
		console.error(error);
	}

	app.listen(3000, () => {
		console.log('Auth: Listening in 3000!')
	});

}

start();