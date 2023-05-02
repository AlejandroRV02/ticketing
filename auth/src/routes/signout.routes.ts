import express from 'express';

const router = express.Router();

router.get('/signout', (req, res) => {
	req.session = null;
	return res.json({ message: "Signed out" })
});

export { router as signoutRouter };