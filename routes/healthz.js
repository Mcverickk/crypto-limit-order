import express from 'express';
const router = express.Router();


router.get('/', (req, res) => {
    console.log('Healthz check');
    res.status(200).json({ status: 'ok' });
});

export default router;