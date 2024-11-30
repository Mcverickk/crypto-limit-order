const Config = require("../config");
const { getCache, setCache, log } = require("./utils");


const checkOrderExecution = ({ uniqueId, orders }) => {
    const ordersToExecute = [];

    for( const order of orders ) {
        const { id, poolAddress, chain, fromTokenData, toTokenData, triggerPrice, type } = order;
        let ttl;
        const poolData = getCache({ uniqueId, key: `${poolAddress}:${chain}` });
        if( !poolData ) {
            log({ uniqueId, message: `No cached pool data found for ${poolAddress}:${chain}`, colour: 'bgGrey' });
            ttl = 0;
        } else {
            const { dex, lastUpdated } = poolData;

            const priceData = poolData.quote.find(data => (
                data.fromToken === fromTokenData.address.toLowerCase() && 
                data.toToken === toTokenData.address.toLowerCase()
            ));
    
            const { price, name } = priceData;

            const staleDataTimeInMinutes = Math.floor((Date.now() - new Date(lastUpdated)) / (60000));
            
            const { ttl: priceDataTTL, limitPriceReached } = Config.getPriceDataTTL({ uniqueId, name, currentPrice: price, triggerPrice, type, chain, staleDataTimeInMinutes });

            ttl = priceDataTTL;

            if( limitPriceReached ) {
                order.executionData = {...priceData, dex};
                ordersToExecute.push(order);
            }   
        }
        if(!getCache({ uniqueId, key: id }) || ttl === 0){
            setCache({ uniqueId, key: id, value: true, ttl });
        }
    }

    log({ uniqueId, message: `Orders to execute: ${ordersToExecute.length}`, colour: 'bgGrey' });
    return { ordersToExecute };
}

module.exports = { checkOrderExecution };