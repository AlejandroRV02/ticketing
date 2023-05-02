import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@arvtickets/common';
import { User } from '../models/User';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signin',
	[
		body('email').isEmail().withMessage("Email must be valid"),
		body('password').isString().trim().notEmpty().withMessage("Password must not be empty")
	],
	validateRequest,
	async (req: Request, res: Response) => {

		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (!existingUser) throw new BadRequestError('Invalid credentials');

		const areMatchingPasswords = await Password.compare(password, existingUser.password)

		if (!areMatchingPasswords) throw new BadRequestError('Invalid credentials');

		const token = jwt.sign({
			id: existingUser.id,
			email: existingUser.email
		}, process.env.JWT_KEY!);

		req.session = { jwt: token }

		res.status(200).send(existingUser);
	});

export { router as signinRouter };