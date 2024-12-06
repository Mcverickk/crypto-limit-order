const { computePoolAddress } = require('@uniswap/v3-sdk');
const { Pair } = require('@uniswap/v2-sdk');
const  { Token } = require('@uniswap/sdk-core');
const Config = require('../config/index.js');
const { getCache, log, postRequest, logError } = require('./utils.js');

const getPoolAddressesWithExpiredTTL = ({ uniqueId, orders }) => {
    const expiredTTLPoolAddresses = [];

    for(let i = 0; i < orders.length; i++){
        const order = orders[i];
        const { id, fromTokenData, toTokenData, chain } = order;
        const poolAddress = getUniswapV3PoolAddress({ uniqueId, token0: fromTokenData, token1: toTokenData, fee: 3000, chain });
        order.poolAddress = poolAddress;

        if(!getCache({ uniqueId, key: id })){
            expiredTTLPoolAddresses.push([poolAddress, chain.toLowerCase()].join(':'));
        }
    }
    log({ uniqueId, message: `Found ${expiredTTLPoolAddresses.length} orders with expired TTL`, colour: 'bgGrey' });
    return { expiredTTLPoolAddresses };
}


const getUniswapV3PoolAddress = ({ uniqueId, token0, token1, fee, chain}) => {
    const chainId = Config.getChainId('base');
    const tokenA = new Token(chainId, Config.checkCoinAddress({address: token0.address, chain}), token0.decimals);
    const tokenB = new Token(chainId, Config.checkCoinAddress({address: token1.address, chain}), token1.decimals);

    const currentPoolAddress = computePoolAddress({
      factoryAddress: Config.getUniswapFactoryAddress({uniqueId, chain, version: 'v3'}),
      tokenA,
      tokenB,
      fee
    })
    return currentPoolAddress.toLowerCase();
}

const getUniswapV2PoolAddress = ({token0, token1, chain}) => {
    const chainId = Config.getChainId(chain);
    const tokenA = new Token(chainId, Config.checkCoinAddress({address: token0.address, chain}), token0.decimals);
    const tokenB = new Token(chainId, Config.checkCoinAddress({address: token1.address, chain}), token1.decimals);
    const pairAddress = Pair.getAddress(tokenA, tokenB);
    return pairAddress.toLowerCase();
}

const updateLimitOrder = async ({ uniqueId, id, status, dex, txnHash }) => {

    const body = {
        id,
        status,
        dex: dex,
        txnHash,
    };

    const { response, error } = await postRequest({
        uniqueId,
        url: Config.HASURA_UPDATE_ORDER_URL,
        reqBody: body
    });

    if(error || !response?.update_LimitOrder_by_pk){
        logError({ uniqueId, message: `Error updating order for ${id}`, error });
        return { error: 'Error updating order' };
    }

    return { response };
}

module.exports = { getPoolAddressesWithExpiredTTL, updateLimitOrder };