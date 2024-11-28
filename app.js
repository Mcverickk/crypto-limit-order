const express = require('express');
const healthz = require('./routes/healthz.js');
const limitOrders = require('./routes/limitOrders.js');
const Config = require('./config/index.js');

const app = express();

app.use(express.json());

app.use('/healthz', healthz);

app.use('/limit-order', limitOrders);

app.listen(Config.PORT, () => {
    console.log(`Server is running on port ${Config.PORT}`);
})






