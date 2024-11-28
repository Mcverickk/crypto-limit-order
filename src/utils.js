const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache();

const log = ({uniqueId, message, data}) => {
    if(data) {
        console.log(`[${uniqueId}] ${message}`, data);
    } else {
        console.log(`[${uniqueId}] ${message}`);
    }
}

const logError = ({uniqueId, message, error}) => {
    if(error){
        console.error(`[${uniqueId}] ${message}`, error);
    } else {
        console.error(`[${uniqueId}] ${message}`);
    }
}

const setCache = ({ uniqueId, key, value, ttl}) => {
    // log({uniqueId, message: `Setting cache for key: ${key} for ${ttl} seconds`});
    cache.set(key, value, ttl);
}

const getCache = ({ uniqueId, key}) => {
    // log({uniqueId, message: `Getting cache for key: ${key}`});
    return cache.get(key);
}

const getRequest = async ({ uniqueId, url, headers}) => {
    try {
        // log({uniqueId, message: `Making GET request to: ${url}`});
        const response = await axios.get(url, { headers });
        return { response: response.data };       
    } catch (error) {
        return { error };
    }
}

const postRequest = async ({ uniqueId, url, reqBody}) => {
    try {
        // log({uniqueId, message: `Making POST request to: ${url}`});
        const response = await axios.post(url, reqBody);
        return { response: response.data };
    } catch (error) {
        return { error };
    }
}

module.exports = { log, logError, setCache, getCache, getRequest, postRequest };