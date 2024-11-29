const { log, postRequest } = require("./utils");


const triggerTxn = async ({uniqueId, order, priceData}) => {
    log({ uniqueId, message: `==========LIMIT PRICE REACHED==========` });
    log({ uniqueId, message: `Triggering ${priceData.pairName} txn for id ${order.id} at price ${priceData.price}` });

    const body = {
        id: order.id,
        status: "COMPLETED",
        dex: priceData.dex,
        txnHash: priceData.price.toString(),
    };

    const { response, error } = await postRequest({
        uniqueId,
        url: config.HASURA_UPDATE_ORDER_URL,
        reqBody: body
    });

    if(error || !response?.update_LimitOrder_by_pk){
        log({ uniqueId, message: "Error updating order", error });
    }
}


module.exports = triggerTxn;