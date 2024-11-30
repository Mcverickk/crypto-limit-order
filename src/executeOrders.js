const Config = require("../config");
const { fetchActiveOrdersFromHasura } = require("./fetchActiveOrders");
const { log, postRequest, logError } = require("./utils");

const executeOrders = async ({uniqueId, orders}) => {
    if(orders.length === 0){
        return;
    }
    const executedOrders = [];

    for(const order of orders){
        const { id, triggerPrice, type, executionData } = order;
        const { dex, name } = executionData;
        log({ uniqueId, message: `Executing ${type} order ${id} for ${name} at price ${triggerPrice}` });

        const body = {
            id,
            status: "COMPLETED",
            dex: dex,
            txnHash: JSON.stringify(executionData),
        };

        const { response, error } = await postRequest({
            uniqueId,
            url: Config.HASURA_UPDATE_ORDER_URL,
            reqBody: body
        });

        if(error || !response?.update_LimitOrder_by_pk){
            logError({ uniqueId, message: `Error updating order for ${id}`, error });
            continue;
        }
        
        executedOrders.push(id);
    }
    
    log({ uniqueId, message: `Executed orders: [${executedOrders.join(',')}]`, colour: 'bgBrightGreen' });
    await fetchActiveOrdersFromHasura({ uniqueId });
}


module.exports = { executeOrders };