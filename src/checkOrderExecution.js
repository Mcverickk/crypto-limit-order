const Config = require("../config");
const { getCache, setCache, log } = require("./utils");


const checkOrderExecution = ({ uniqueId, orders }) => {
    const ordersToExecute = [];
 
    for(let i = 0; i < orders.length; i++){
        const order = orders[i];
        const { id, poolAddress, chain, fromTokenData, toTokenData, triggerPrice } = order;
        let ttl;
        const poolData = getCache({ uniqueId, key: `${poolAddress}:${chain}` });
        if( !poolData ) {
            log({ uniqueId, message: `No cached pool data found for ${poolAddress}:${chain}`, colour: 'bgGrey' });
            ttl = 2;
        } else {
            const { dex, lastUpdated } = poolData;

            const poolFromToken = Config.checkCoinAddress({address: fromTokenData.address.toLowerCase(), chain});
            const poolToToken = Config.checkCoinAddress({address: toTokenData.address.toLowerCase(), chain});

            const priceData = poolData.quote.find(data => (
                data.fromToken ===  poolFromToken && 
                data.toToken === poolToToken
            ));

            if(!priceData){
                log({ uniqueId, message: `No price data found for ${fromTokenData.address} to ${toTokenData.address} on ${chain}`, colour: 'bgGrey' });
                ttl = 2;
            }
    
            const { price, name } = priceData;

            const staleDataTimeInMinutes = Math.floor((Date.now() - new Date(lastUpdated)) / (60000));
            
            const { ttl: priceDataTTL, limitPriceReached } = Config.getPriceDataTTL({ uniqueId, name, currentPrice: price, triggerPrice, chain, staleDataTimeInMinutes });

            ttl = priceDataTTL;

            if( limitPriceReached ) {
                order.executionData = {...priceData, dex};
                ordersToExecute.push(order);
            }   
        }
        if(!getCache({ uniqueId, key: id }) || ttl === 2){
            setCache({ uniqueId, key: id, value: true, ttl });
        }
    }

    log({ uniqueId, message: `Orders to execute: ${ordersToExecute.length}`, colour: 'bgGrey' });
    return { ordersToExecute };
}

module.exports = { checkOrderExecution };