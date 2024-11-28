const Config = require("../config/index.js");
const { getRequest, getUniswapV3PoolAddress } = require("./utils.js");


const getPriceData = async ({fromToken, toToken, chain}) => {

    const poolAddress = getUniswapV3PoolAddress({
        token0: fromToken,
        token1: toToken,
        chain,
        fee: 3000
    });

    const { response: poolDataResponse, error: poolDataError } = await fetchPoolDataFromCMC({poolAddress, chain});

    if(poolDataError){
        return { error: poolDataError };
    }

    const priceData = formatPriceData({ poolDataResponse, fromTokenAddress: fromToken.address, toTokenAddress: toToken.address });

    return { response: priceData };
}

const fetchPoolDataFromCMC = async ({poolAddress, chain}) => {
    const networkId = Config.getCoinMarketCapNetworkId(chain);

    const url = `${Config.CMC_DEX_POOL_DATA_URL}?network_id=${networkId}&contract_address=${poolAddress}`;

    const headers = {
        'X-CMC_PRO_API_KEY': Config.X_CMC_PRO_API_KEY
    }

    const { response: normalPairResponse, error } = await getRequest({url, headers});

    if(error){
        console.error("Error fetching price from CMC", error);
        return { error };
    }

    const data = normalPairResponse?.data;

    if(data?.length === 0){
        console.log(`No data found for the pool ${poolAddress} in CMC on chain ${chain}`);
        return { error: "No data found for the token pair in CMC" };
    }

    const response = {
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



module.exports = getPriceData;