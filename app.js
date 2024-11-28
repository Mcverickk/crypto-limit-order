const express = require('express');
const healthz = require('./routes/healthz.js');
const limitOrders = require('./routes/limitOrders.js');
const Config = require('./config/index.js');
const cron = require('node-cron');
const fetchActiveOrders = require('./src/fetchActiveOrders.js');
const fetchPriceData = require('./src/fetchPriceData.js');
const { log } = require('./src/utils.js');


const app = express();

app.use(express.json());

app.use('/healthz', healthz);

app.use('/limit-order', limitOrders);

app.listen(Config.PORT, () => {
    console.log(`Server is running on port ${Config.PORT}`);
})

cron.schedule(`*/${Config.CRON_JOB_FREQ_IN_SEC} * * * * *`, async () => {
    log({ message: new Date() + "Cron job triggered" });
    triggerPriceCheck();
})

const triggerPriceCheck = async () => {
    const uniqueId = Math.random().toString(36).substring(2, 10);

    const {response: orders} = await fetchActiveOrders({ uniqueId });

    for(let i = 0; i < orders.length; i++){
        const order = orders[i];
        const { response } = fetchPriceData({ uniqueId: `${uniqueId}-${i}:`, order });
    }
}






