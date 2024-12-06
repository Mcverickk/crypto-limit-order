const { getChainId, getCoinMarketCapNetworkId, SUPPORTED_CHAINS, getChainFromCMCNetworkId, getInfuraRPCUrl, getSwapContractAddress, checkCoinAddress, ZERO_ADDRESS } = require('../constants/ChainConstants');
const { UniswapFactoryAddress } = require('../constants/UniswapConstants');
const { getPriceDataTTL } = require('./priceDataTTLConfig');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    CRON_JOB_FREQ_IN_SEC: process.env.CRON_JOB_FREQ_IN_SEC,
    HASURA_ACTIVE_ORDERS_URL: process.env.HASURA_ACTIVE_ORDERS_URL,
    HASURA_CREATE_ORDER_URL: process.env.HASURA_CREATE_ORDER_URL,
    HASURA_ORDERS_BY_ADDRESS_URL: process.env.HASURA_ORDERS_BY_ADDRESS_URL,
    HASURA_UPDATE_ORDER_URL: process.env.HASURA_UPDATE_ORDER_URL,
    ORDER_CACHE_TIME_IN_SECONDS: process.env.ORDER_CACHE_TIME_IN_SECONDS,
    CMC_DEX_POOL_DATA_URL: process.env.CMC_DEX_POOL_DATA_URL,
    X_CMC_PRO_API_KEY: process.env.X_CMC_PRO_API_KEY,
    getUniswapFactoryAddress: UniswapFactoryAddress,
    getChainId,
    getCoinMarketCapNetworkId,
    getPriceDataTTL,
    SUPPORTED_CHAINS,
    getChainFromCMCNetworkId,
    DEFAULT_PRICE_DATA_TTL: process.env.DEFAULT_PRICE_DATA_TTL,
    STALE_PRICE_DATA_TIME_IN_MINUTES: process.env.STALE_PRICE_DATA_TIME_IN_MINUTES,
    getRPCUrlForChain: getInfuraRPCUrl,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    getSwapContractAddress,
    checkCoinAddress,
    ZERO_ADDRESS
}