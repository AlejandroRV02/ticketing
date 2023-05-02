import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@arvtickets/common';
import { createChargeRouter } from './routes/create-charge.routes';

const app = express();
const base = '/api/payments';

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== "test"
}));

app.use(currentUser)

app.use(base, createChargeRouter)

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app }