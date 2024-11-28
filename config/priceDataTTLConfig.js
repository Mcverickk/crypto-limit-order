const { log } = require("../src/utils");

const getPriceDataTTL = ({ uniqueId, priceData, triggerPrice, id}) => {
    const currentPrice = priceData.price;
    const percentChangeNeeded = (triggerPrice - currentPrice) * 100 / currentPrice;
    // log({ uniqueId, message: `Percent Change Needed for ${id} is ${percentChangeNeeded}%` });
    const absPercentChangeNeeded = Math.abs(percentChangeNeeded);
    let ttl;

    if(absPercentChangeNeeded < 1){
        ttl = 15;
    } else if(absPercentChangeNeeded < 2){
        ttl = 30;
    } else if(absPercentChangeNeeded < 3){
        ttl = 90;
    } else  if(absPercentChangeNeeded < 5){
        ttl = 300;
    } else if (absPercentChangeNeeded < 10){
        ttl = 600;
    } else {
        ttl = 1800;
    }

    return ttl;
}

module.exports = { getPriceDataTTL };