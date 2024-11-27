import { getCache, getRequest, setCache } from "./utils.js";
import dotenv from 'dotenv';

dotenv.config();

const fetchOrders = async () => {
    let orders = getCache("orders");
    if(!orders){
        console.log("CACHE MISS for orders");
        try{
            orders = await fetchActiveOrdersFromHasura();
        } catch (error){
            return { error };
        }
    }
    console.log("Orders:", orders);
    return { response: orders };
}

const fetchActiveOrdersFromHasura = async () => {
    const { response, error } = await getRequest(process.env.HASURA_ACTIVE_ORDERS_URL);
    if(error || !response){
        console.error("Error fetching active orders from Hasura", error);
        throw new Error("Error fetching active orders from Hasura");
    }

    setCache("orders", response?.LimitOrder, 30);
    return response?.LimitOrder;
}

export default fetchOrders;