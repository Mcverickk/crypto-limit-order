const { log } = require("../src/utils");

const getPriceDataTTL = ({ uniqueId, name, currentPrice, triggerPrice, type, chain, staleDataTimeInMinutes}) => {
    const percentChangeNeeded = (triggerPrice - currentPrice) * 100 / currentPrice;
    
    if (
        (type.toUpperCase() === "BUY" && percentChangeNeeded > 0) ||
        (type.toUpperCase() === "SELL" && percentChangeNeeded < 0)
    ) {
        log({ uniqueId, message: `${name}@${chain}: Limit price reached for trigger price ${triggerPrice}`, colour: 'bgBrightGreen' });
        return { ttl: 0, limitPriceReached : true };
    } else {
        if(staleDataTimeInMinutes > 5){
            log({ uniqueId, message: `${name}@${chain}: Price - ${currentPrice}(${staleDataTimeInMinutes}mins old), Change needed - ${percentChangeNeeded}% for ${type}`, colour: 'red' });
        } else {
            log({ uniqueId, message: `${name}@${chain}: Price - ${currentPrice}(${staleDataTimeInMinutes}mins old), Change needed - ${percentChangeNeeded}% for ${type}` });
        }
    }
    
    let ttl;
    const absPercentChangeNeeded = Math.abs(percentChangeNeeded);

    switch (true) {
        case (absPercentChangeNeeded < 1):
            ttl = 45;
            break;
        case (absPercentChangeNeeded < 2):
            ttl = 90;
            break;
        case (absPercentChangeNeeded < 3):
            ttl = 180;
            break;
        case (absPercentChangeNeeded < 5):
            ttl = 300;
            break;
        case (absPercentChangeNeeded < 10):
            ttl = 600;
            break;
        default:
            ttl = 1800;
            break;
    }

    return { ttl, limitPriceReached: false };
}

module.exports = { getPriceDataTTL };