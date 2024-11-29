const Config = require("../config/index.js");
const { getUniswapV3PoolAddress } = require("./cryptoUtils.js");
const triggerTxn = require("./triggerTxn.js");
const { getRequest, getCache, setCache, log, logError } = require("./utils.js");

const fetchPriceData = async ({ uniqueId, order }) => {
    const { id, triggerPrice, fromTokenData: fromToken, toTokenData: toToken, chain, type } = order;
    
    const priceDataKey = `${fromToken.symbol.toUpperCase()}/${toToken.symbol.toUpperCase()}@${chain.toLowerCase()}`;
    // log({ uniqueId, message: `Fetching Price Data for ${priceDataKey}` });

    let priceData = getCache({ uniqueId, key: priceDataKey});
    const isPriceDataLatest = getCache({ uniqueId, key: id});

    if(!priceData || !isPriceDataLatest){
        // log({ uniqueId, message: `Cache Miss for ${priceDataKey}` });

        const { response, error } = await fetchLatestPriceData({ uniqueId, fromToken, toToken, chain });
        if(error){
            return { error };
        }
        priceData = response;

        const { ttl, limitPriceReached } = Config.getPriceDataTTL({ uniqueId, priceData, triggerPrice, id, type });
        setCache({ uniqueId, key: priceDataKey, value: priceData, ttl});
        setCache({ uniqueId, key:id, value: true, ttl});

        if(limitPriceReached){
            triggerTxn({ uniqueId, order, priceData });
        }
    }

    log({ uniqueId, message: `Fetched Price Data for ${priceDataKey}: ${priceData.price}` });
}

const fetchLatestPriceData = async ({ uniqueId, fromToken, toToken, chain }) => {

    // log({uniqueId, message: "Fetching uniswap pool address"});
    const poolAddress = getUniswapV3PoolAddress({
        uniqueId,
        token0: fromToken,
        token1: toToken,
        chain,
        fee: 3000
    });

    const { response: poolDataResponse, error: poolDataError } = await fetchPoolDataFromCMC({uniqueId, poolAddress, chain});

    if(poolDataError){
        return { error: poolDataError };
    }

    const priceData = formatPriceData({ poolDataResponse, fromTokenAddress: fromToken.address, toTokenAddress: toToken.address });

    return { response: priceData };
}

const fetchPoolDataFromCMC = async ({uniqueId, poolAddress, chain}) => {
    const networkId = Config.getCoinMarketCapNetworkId(chain);

    const url = `${Config.CMC_DEX_POOL_DATA_URL}?network_id=${networkId}&contract_address=${poolAddress}`;

    const headers = {
        'X-CMC_PRO_API_KEY': Config.X_CMC_PRO_API_KEY
    }

    const { response: normalPairResponse, error } = await getRequest({uniqueId, url, headers});

    if(error){
        logError({uniqueId, message: "Error fetching price from CMC", error});
        return { error };
    }

    const data = normalPairResponse?.data;

    if(data?.length === 0){
        log({uniqueId, message: `No data found for the pool ${poolAddress} in CMC on chain ${chain}`});
        return { error: "No data found for the token pair in CMC" };
    }

    const response = {
        "pairName" : `${data[0].base_asset_symbol}/${data[0].quote_asset_symbol}`,
        "fromToken" : data[0].base_asset_contract_address,
        "toToken" : data[0].quote_asset_contract_address,
        "chain" : chain,
        "price" : data[0].quote[0].price_by_quote_asset,
        "priceInUSD" : data[0].quote[0].price,
        "lastUpdated" : data[0].quote[0].last_updated,
        "dex" : data[0].dex_slug
    }

    return { response };
}

const formatPriceData = ({poolDataResponse, fromTokenAddress, toTokenAddress}) => {
    if (
        poolDataResponse.fromToken.toLowerCase() === toTokenAddress.toLowerCase() &&
        poolDataResponse.toToken.toLowerCase() === fromTokenAddress.toLowerCase()
    ) {
        poolDataResponse.price = 1 / poolDataResponse.price;
        poolDataResponse.priceInUSD = poolDataResponse.price * poolDataResponse.priceInUSD;
        poolDataResponse.fromToken = fromTokenAddress;
        poolDataResponse.toToken = toTokenAddress;
    }
    return poolDataResponse;
}


module.exports = fetchPriceData;