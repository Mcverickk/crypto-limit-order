const { log } = require("../src/utils");

const getPriceDataTTL = ({ uniqueId, priceData, triggerPrice, id, type}) => {
    const currentPrice = priceData.price;
    const percentChangeNeeded = (triggerPrice - currentPrice) * 100 / currentPrice;
    
    let limitPriceReached = false;
    
    if (
        (type.toLowerCase() === "buy" && percentChangeNeeded > 0) ||
        (type.toLowerCase() === "sell" && percentChangeNeeded < 0)
    ) {
        limitPriceReached = true;
    } else {
        log({ uniqueId, message: `${priceData.pairName}@${priceData.chain}: ${percentChangeNeeded}% change needed` });
    }

    const absPercentChangeNeeded = Math.abs(percentChangeNeeded);
    let ttl;

    switch (true) {
        case (absPercentChangeNeeded < 1):
            ttl = 60;
            break;
        case (absPercentChangeNeeded < 2):
            ttl = 120;
            break;
        case (absPercentChangeNeeded < 3):
            ttl = 300;
            break;
        case (absPercentChangeNeeded < 5):
            ttl = 900;
            break;
        case (absPercentChangeNeeded < 10):
            ttl = 3600;
            break;
        default:
            ttl = 7200;
            break;
    }

    return { ttl, limitPriceReached };
}

module.exports = { getPriceDataTTL };