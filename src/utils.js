const axios = require('axios');
const NodeCache = require('node-cache');
const { computePoolAddress } = require('@uniswap/v3-sdk');
const { Pair } = require('@uniswap/v2-sdk');
const  { Token } = require('@uniswap/sdk-core');
const Config = require('../config/index.js');

const cache = new NodeCache();

const setCache = (key, value, ttl) => {
    console.log(`Setting cache for key: ${key}`);
    cache.set(key, value, ttl);
}

const getCache = (key) => {
    console.log(`Getting cache for key: ${key}`);
    return cache.get(key);
}

const getRequest = async ({url, headers}) => {
    try {
        console.log(`Making GET request to: ${url}`);
        const response = await axios.get(url, { headers });
        return { response: response.data };       
    } catch (error) {
        return { error };
    }
}

const postRequest = async ({url, reqBody}) => {
    try {
        console.log(`Making POST request to: ${url}`);
        const response = await axios.post(url, reqBody);
        return { response: response.data };
    } catch (error) {
        return { error };
    }
}


const getUniswapV3PoolAddress = ({token0, token1, fee, chain}) => {
    const chainId = Config.getChainId(chain);
    const tokenA = new Token(chainId, token0.address, token0.decimals);
    const tokenB = new Token(chainId, token1.address, token1.decimals);

    const currentPoolAddress = computePoolAddress({
      factoryAddress: Config.getUniswapFactoryAddress({chain, version: 'v3'}),
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

module.exports = { setCache, getCache, getRequest, postRequest, getUniswapV3PoolAddress, getUniswapV2PoolAddress };