import express from 'express';
import healthz from './routes/healthz.js';
import limitOrders from './routes/limitOrders.js';
import Config from './config/index.js';

const app = express();

app.use(express.json());

app.use('/healthz', healthz);

app.use('/limit-order', limitOrders);

app.listen(Config.PORT, () => {
    console.log(`Server is running on port ${Config.PORT}`);
})






