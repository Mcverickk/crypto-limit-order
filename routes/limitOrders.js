const express = require('express');
const Config = require('../config');
const { getRequest, postRequest } = require('../src/utils.js');

const router = express.Router();

router.post('/create', async (req, res) => {
    const { body } = req;
    console.log("Creating order", body);
    const { response, error } = await postRequest({
        url: Config.HASURA_CREATE_ORDER_URL,
        reqBody: body
    });
    if (error || !response?.insert_LimitOrder_one) {
        console.error("Error creating order", error);
        return res.status(500).send('Internal server error');
    }
    return res.status(200).send(response.insert_LimitOrder_one);
})

router.get('/address/:address', async (req, res) => {
    const { address } = req.params;
    console.log("Getting orders for address", address);
    const { response, error } = await getRequest({
        url: Config.HASURA_ORDERS_BY_ADDRESS_URL + '/' + address,
    });
    if (error || !response?.LimitOrder) {
        console.error("Error getting orders", error);
        return res.status(500).send('Internal server error');
    }
    return res.status(200).send(response.LimitOrder);
})

module.exports = router;