import cron from 'node-cron';
import fetchOrders from './src/fetchOrders.js';

cron.schedule('*/20 * * * * *', () => {
    fetchOrders();
});




