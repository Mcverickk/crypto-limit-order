const { log } = require("./utils");


const triggerTxn = async ({uniqueId, order, priceData}) => {
    log({ uniqueId, message: `==========LIMIT PRICE REACHED==========` });
    log({ uniqueId, message: `Triggering ${priceData.pairName} txn for id ${order.id} at price ${priceData.price}` });
}


module.exports = triggerTxn;