const express = require('express');
const Config = require('../config');
const { getRequest, postRequest, log, logError } = require('../src/utils.js');

const router = express.Router();

router.post('/create', async (req, res) => {
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const { body } = req;
    log({ uniqueId, message: "Creating order", data: body });
    const { response, error } = await postRequest({
        uniqueId,
        url: Config.HASURA_CREATE_ORDER_URL,
        reqBody: body
    });
    if (error || !response?.insert_LimitOrder_one) {
        logError({ uniqueId, message: "Error creating order", error });
        return res.status(500).send('Internal server error');
    }
    return res.status(200).send(response.insert_LimitOrder_one);
})

router.get('/address/:address', async (req, res) => {
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const { address } = req.params;
    log({ uniqueId, message: "Getting orders for address" + address });
    const { response, error } = await getRequest({
        uniqueId,
        url: Config.HASURA_ORDERS_BY_ADDRESS_URL + '/' + address,
    });
    if (error || !response?.LimitOrder) {
        logError({ uniqueId, message: "Error getting orders", error });
        return res.status(500).send('Internal server error');
    }
    return res.status(200).send(response.LimitOrder);
})

module.exports = router;