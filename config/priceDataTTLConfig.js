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
        log({ uniqueId, message: `Percent Change Needed for ${priceData.pairName} is ${percentChangeNeeded}%` });
    }

    const absPercentChangeNeeded = Math.abs(percentChangeNeeded);
    let ttl;

    switch (true) {
        case (absPercentChangeNeeded < 1):
            ttl = 15;
            break;
        case (absPercentChangeNeeded < 2):
            ttl = 30;
            break;
        case (absPercentChangeNeeded < 3):
            ttl = 90;
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

    return { ttl, limitPriceReached };
}

module.exports = { getPriceDataTTL };