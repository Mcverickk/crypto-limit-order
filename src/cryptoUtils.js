const { computePoolAddress } = require('@uniswap/v3-sdk');
const { Pair } = require('@uniswap/v2-sdk');
const  { Token } = require('@uniswap/sdk-core');
const Config = require('../config/index.js');


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
    return currentPoolAddress;
}

const getUniswapV2PoolAddress = ({token0, token1, chain}) => {
    const chainId = Config.getChainId(chain);
    const tokenA = new Token(chainId, token0.address, token0.decimals);
    const tokenB = new Token(chainId, token1.address, token1.decimals);
    const pairAddress = Pair.getAddress(tokenA, tokenB);
    return pairAddress;
}

module.exports = { getUniswapV3PoolAddress, getUniswapV2PoolAddress };