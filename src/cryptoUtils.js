const { computePoolAddress } = require('@uniswap/v3-sdk');
const { Pair } = require('@uniswap/v2-sdk');
const  { Token } = require('@uniswap/sdk-core');
const Config = require('../config/index.js');
const { getCache, log } = require('./utils.js');

const getPoolAddressesWithExpiredTTL = ({ uniqueId, orders }) => {
    const expiredTTLPoolAddresses = [];

    for(const order of orders){
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
    const tokenA = new Token(chainId, token0.address, token0.decimals);
    const tokenB = new Token(chainId, token1.address, token1.decimals);

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
    const tokenA = new Token(chainId, token0.address, token0.decimals);
    const tokenB = new Token(chainId, token1.address, token1.decimals);
    const pairAddress = Pair.getAddress(tokenA, tokenB);
    return pairAddress.toLowerCase();
}

module.exports = { getPoolAddressesWithExpiredTTL };