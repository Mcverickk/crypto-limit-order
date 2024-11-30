const express = require('express');
const healthz = require('./routes/healthz.js');
const limitOrders = require('./routes/limitOrders.js');
const Config = require('./config/index.js');
const { log } = require('./src/utils.js');
const cron = require('node-cron');
const { fetchActiveOrders } = require('./src/fetchActiveOrders.js');
const { getPoolAddressesWithExpiredTTL } = require('./src/cryptoUtils.js');
const { fetchPriceData } = require('./src/fetchPriceData.js');
const { checkOrderExecution } = require('./src/checkOrderExecution.js');
const { executeOrders } = require('./src/executeOrders.js');


const app = express();

app.use(express.json());

app.use('/healthz', healthz);

app.use('/limit-order', limitOrders);

app.listen(Config.PORT, () => {
    console.log(`Server is running on port ${Config.PORT}`);
})

cron.schedule(`*/${Config.CRON_JOB_FREQ_IN_SEC} * * * * *`, async () => {
    const uniqueId = Math.random().toString(36).substring(2, 10);
    log({uniqueId: '\n' + uniqueId, message: new Date() + " Cron job triggered", colour:"bgRed"});
    triggerOrderCheck({uniqueId});
})

const triggerOrderCheck = async ({uniqueId}) => {
    const { orders } = await fetchActiveOrders({ uniqueId });
    const { expiredTTLPoolAddresses } = getPoolAddressesWithExpiredTTL({ uniqueId, orders });
    await fetchPriceData({ uniqueId, poolAddresses: expiredTTLPoolAddresses });
    const { ordersToExecute } = checkOrderExecution({ uniqueId, orders });
    await executeOrders({ uniqueId, orders: ordersToExecute });
}





