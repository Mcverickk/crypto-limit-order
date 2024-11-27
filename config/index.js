import dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT,
    HASURA_ACTIVE_ORDERS_URL: process.env.HASURA_ACTIVE_ORDERS_URL,
    HASURA_CREATE_ORDER_URL: process.env.HASURA_CREATE_ORDER_URL,
    HASURA_ORDERS_BY_ADDRESS_URL: process.env.HASURA_ORDERS_BY_ADDRESS_URL,
    ORDER_CACHE_TIME_IN_SECONDS: process.env.ORDER_CACHE_TIME_IN_SECONDS
}