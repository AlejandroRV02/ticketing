import express from 'express';
import { currentUser } from '@arvtickets/common';

const router = express.Router();

router.get('/current-user', currentUser, (req, res) => {

	return res.json({ currentUser: req.currentUser || null })
});

export { router as currentUserRouter };