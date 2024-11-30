const Config = require("../config/index.js");
const { getRequest, setCache, log, logError } = require("./utils.js");

const fetchPriceData = async ({ uniqueId, poolAddresses }) => {
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
        const {response: priceData, error} = await fetchPoolDataFromCMC({uniqueId, chain, poolAddresses: poolAddressesWithoutChain});
        if(error){
            continue;
        }
        poolData.push(...priceData);
    }
    formatAndCachePriceData({uniqueId, poolData});
}

const fetchPoolDataFromCMC = async ({uniqueId, chain, poolAddresses}) => {
    const networkId = Config.getCoinMarketCapNetworkId(chain);

    const url = `${Config.CMC_DEX_POOL_DATA_URL}?network_id=${networkId}&contract_address=${poolAddresses.join(",")}`;

    const headers = {
        'X-CMC_PRO_API_KEY': Config.X_CMC_PRO_API_KEY
    }

    const { response: poolDataResponse, error } = await getRequest({uniqueId, url, headers});

    if(error){
        logError({uniqueId, message: `Error fetching price from CMC for [${chain}]`, error});
        return { error };
    }

    const data = poolDataResponse?.data;

    if(data?.length === 0){
        logError({uniqueId, message: `No data fetched from CMC for [${chain}]`});
        return { error: `No data fetched from CMC for [${chain}]` };
    }

    return { response: data };
}

const formatAndCachePriceData = ({uniqueId, poolData}) => {
    for (const poolDataResponse of poolData) {
        const {
            contract_address, 
            network_id, 
            base_asset_symbol,
            quote_asset_symbol,
            base_asset_contract_address, 
            quote_asset_contract_address,
            quote,
            dex_slug
        } = poolDataResponse;

        if(contract_address === undefined || network_id === undefined || base_asset_symbol === undefined || quote_asset_symbol === undefined || base_asset_contract_address === undefined || quote_asset_contract_address === undefined || quote === undefined || dex_slug === undefined){
            log({uniqueId, message: `Missing data for pool:`, data: poolDataResponse, colour: 'red'});
            continue;
        }

        const { price, price_by_quote_asset, last_updated } = quote[0];
        const chain = Config.getChainFromCMCNetworkId(network_id);
        const poolAddress = contract_address.toLowerCase();

        const priceData = {
            poolAddress,
            chain,
            quote : [{
                name : [base_asset_symbol.toUpperCase(), quote_asset_symbol.toUpperCase()].join("/"),
                fromToken : base_asset_contract_address,
                toToken : quote_asset_contract_address,
                price : price_by_quote_asset,
                priceInUSD : price,
            },
            {
                name : [quote_asset_symbol.toUpperCase(), base_asset_symbol.toUpperCase()].join("/"),
                fromToken : quote_asset_contract_address,
                toToken : base_asset_contract_address,
                price : 1 / price_by_quote_asset,
                priceInUSD : price / price_by_quote_asset,
            }],
            lastUpdated : last_updated,
            dex : dex_slug
        }

        setCache({ 
            uniqueId,
            key: `${poolAddress}:${chain}`, 
            value: priceData, 
            ttl: Config.DEFAULT_PRICE_DATA_TTL
        });
    }
    log({uniqueId, message: `Fetched and cached ${poolData.length} price data`, colour: 'bgCyan'});
}

module.exports = { fetchPriceData };