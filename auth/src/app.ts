import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@arvtickets/common';
import { currentUserRouter } from './routes/current-user.routes';
import { signinRouter } from './routes/signin.routes';
import { signoutRouter } from './routes/signout.routes';
import { signupRouter } from './routes/signup.routes';


const app = express();
const base = '/api/auth';

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
	signed: false,
	secure: false
}));

app.use(base, currentUserRouter);
app.use(base, signinRouter);
app.use(base, signoutRouter);
app.use(base, signupRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app }