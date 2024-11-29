const { getCache, getRequest, setCache, log, logError } = require("./utils.js");
const Config = require('../config/index.js');

const fetchActiveOrders = async ({ uniqueId }) => {
    // log({ uniqueId, message: 'Fetching active orders' });
    let orders = getCache({uniqueId, key: "orders"});
    if(!orders){
        // log({ uniqueId, message: 'CACHE MISS: Active orders' });
        try{
            orders = await fetchActiveOrdersFromHasura({ uniqueId });
            log({ uniqueId, message: `Fetched ${orders.length} active orders` });
        } catch (error){
            return { error };
        }
    } else {
        log({ uniqueId, message: `Fetched ${orders.length} active orders from cache` });
    }
    return { response: orders };
}

const fetchActiveOrdersFromHasura = async ({ uniqueId }) => {
    const { response, error } = await getRequest({uniqueId, url: Config.HASURA_ACTIVE_ORDERS_URL});
    if(error || !response){
        logError({ uniqueId, message: "Error fetching active orders from Hasura", error });
        throw new Error("Error fetching active orders from Hasura");
    }
    setCache({uniqueId, key: "orders", value: response?.LimitOrder, ttl: Config.ORDER_CACHE_TIME_IN_SECONDS});
    return response?.LimitOrder;
}

module.exports = { fetchActiveOrders, fetchActiveOrdersFromHasura};