const Config = require("../config/index.js");
const { getRequest } = require("./utils.js");


const getTradingPrice = async ({fromToken, toToken, networkId, priceType= "high"}) => {
    const { response, error } = await fetchCMCPrice({fromToken, toToken, networkId, priceType});

    if(error){
        return { error };
    }

    return { response };
}

const fetchCMCPrice = async ({fromToken, toToken, networkId, priceType}) => {
    let data;

    const headers = {
        'X-CMC_PRO_API_KEY': Config.X_CMC_PRO_API_KEY
    }

    const url = getCMCPriceUrl({fromToken, toToken, networkId});
    const { response: normalPairResponse, error } = await getRequest({url, headers});

    if(error){
        console.error("Error fetching price from CMC", error);
        return { error };
    }

    data = normalPairResponse?.data;

    if(data.length === 0){
        const reverseUrl = getCMCPriceUrl({fromToken: toToken, toToken: fromToken, networkId});
        const { response: reversePairResponse, error } = await getRequest({url: reverseUrl, headers});
        if(error){
            console.error("Error fetching price from CMC", error);
            return { error };
        }
        data = reversePairResponse?.data;
    }

    if(data.length === 0){
        console.log("No data found for the token pair in CMC " + fromToken + " - " + toToken);
        return { error: "No data found for the token pair in CMC" };
    }

    if(data.length !== 1){
        if(priceType === "high"){
            data.sort((a, b) => b.quote[0].price_by_quote_asset - a.quote[0].price_by_quote_asset);
        } else {
            data.sort((a, b) => a.quote[0].price_by_quote_asset - b.quote[0].price_by_quote_asset);
        }
    }

    return { response: data[0]?.quote[0]?.price_by_quote_asset };
}

const getCMCPriceUrl = ({fromToken, toToken, networkId}) => {
    const fromTokenStr = fromToken ? `&base_asset_contract_address=${fromToken}` : "";
    const toTokenStr = toToken ? `&quote_asset_contract_address=${toToken}` : "";
    return `${Config.CMC_DEX_PRICE_DATA_URL}?network_id=${networkId}${fromTokenStr}${toTokenStr}`;
}

export default getTradingPrice;