const { getChainId } = require('../constants/ChainConstants');
const { UniswapFactoryAddress } = require('../constants/UniswapConstants');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    HASURA_ACTIVE_ORDERS_URL: process.env.HASURA_ACTIVE_ORDERS_URL,
    HASURA_CREATE_ORDER_URL: process.env.HASURA_CREATE_ORDER_URL,
    HASURA_ORDERS_BY_ADDRESS_URL: process.env.HASURA_ORDERS_BY_ADDRESS_URL,
    ORDER_CACHE_TIME_IN_SECONDS: process.env.ORDER_CACHE_TIME_IN_SECONDS,
    CMC_DEX_PRICE_DATA_URL: process.env.CMC_DEX_PRICE_DATA_URL,
    X_CMC_PRO_API_KEY: process.env.X_CMC_PRO_API_KEY,
    getUniswapFactoryAddress: UniswapFactoryAddress,
    getChainId
}