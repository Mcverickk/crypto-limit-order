const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log('Healthz check');
    res.status(200).json({ status: 'ok' });
});

module.exports = router;