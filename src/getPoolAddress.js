const { computePoolAddress } = require('@uniswap/v3-sdk');
const { Pair } = require('@uniswap/v2-sdk');
const  { Token } = require('@uniswap/sdk-core');
const Config = require('../config/index.js');


const getUniswapV3PoolAddress = ({token0, token1, fee, chainName}) => {
    const chainId = Config.getChainId(chainName);
    const tokenA = new Token(chainId, token0.address, token0.decimals);
    const tokenB = new Token(chainId, token1.address, token1.decimals);

    const currentPoolAddress = computePoolAddress({
      factoryAddress: Config.getUniswapFactoryAddress({chainName, version: 'v3'}),
      tokenA,
      tokenB,
      fee
    })
    console.log(`Pool Address for tier ${fee} is ${currentPoolAddress}`);
}

const getUniswapV2PoolAddress = ({token0, token1, chainName}) => {
    const chainId = Config.getChainId(chainName);
    const tokenA = new Token(chainId, token0.address, token0.decimals);
    const tokenB = new Token(chainId, token1.address, token1.decimals);
    const pairAddress = Pair.getAddress(tokenA, tokenB);
    console.log('Pair Address:', pairAddress);
}


module.exports = { getUniswapV3PoolAddress, getUniswapV2PoolAddress };