import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@arvtickets/common';
import { createTicketRouter } from './routes/create-ticket.routes';
import { getTicketByIdRouter } from './routes/get-ticket-by-id.routes';
import { getTicketsRouter } from './routes/get-tickets.routes';
import { updateTicketRouter } from './routes/update-ticket.routes';

const app = express();
const base = '/api/tickets';

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== "test"
}));

app.use(currentUser)

app.use(base, getTicketsRouter)
app.use(base, getTicketByIdRouter)
app.use(base, createTicketRouter)
app.use(base, updateTicketRouter)

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app }