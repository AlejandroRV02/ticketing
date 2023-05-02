import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@arvtickets/common';
import { createOrderRouter } from './routes/create-order.routes';
import { getOrderByIdRouter } from './routes/get-order-by-id.routes';
import { getOrdersRouter } from './routes/get-orders.routes';
import { cancelOrderRouter } from './routes/cancel-order.routes';

const app = express();
const base = '/api/orders';

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== "test"
}));

app.use(currentUser)

app.use(base, getOrdersRouter)
app.use(base, getOrderByIdRouter)
app.use(base, createOrderRouter)
app.use(base, cancelOrderRouter)

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app }