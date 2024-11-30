const Config = require("../config/index.js");
const { fetchPoolDataFromCMC, formatAndCacheCMCPriceData } = require("./pricePartners/coinMarketCap.js");

const fetchPriceData = async ({ uniqueId, poolAddresses, partner }) => {
    if(poolAddresses.length === 0){
        return;
    }
    const uniquePoolAddresses = [...new Set(poolAddresses)];
    const supportedChains = Config.SUPPORTED_CHAINS;
    const poolData = [];
    for (const chain of supportedChains) {
        const poolAddressesForChain = uniquePoolAddresses.filter(poolAddress => poolAddress.split(':')[1] === chain);
        if(poolAddressesForChain.length === 0){
            continue;
        }
        const poolAddressesWithoutChain = poolAddressesForChain.map(poolAddress => poolAddress.split(':')[0]);
        const { response: priceData, error } = await fetchPoolData({uniqueId, chain, poolAddresses: poolAddressesWithoutChain, partner});
        if(error){
            continue;
        }
        poolData.push(...priceData);
    }
    formatAndCachePriceData({uniqueId, poolData, partner});
}


const fetchPoolData = async ({ uniqueId, chain, poolAddresses, partner }) => {
    if(partner === 'coinMarketCap'){
        return await fetchPoolDataFromCMC({uniqueId, chain, poolAddresses});
    }
}

const formatAndCachePriceData = ({ uniqueId, poolData, partner }) => {
    if(partner === 'coinMarketCap'){
        formatAndCacheCMCPriceData({uniqueId, poolData});
    }
}



module.exports = { fetchPriceData };