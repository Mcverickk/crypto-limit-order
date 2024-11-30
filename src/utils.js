const axios = require('axios');
const NodeCache = require('node-cache');
const colors = require("colors");

const cache = new NodeCache();

const log = ({uniqueId, message, data, colour = 'white'}) => {
    if(data) {
        console.log(`${uniqueId}| ${message}`[colour], data);

    } else {
        console.log(`${uniqueId}| ${message}`[colour]);
    }
}

const logError = ({uniqueId, message, error}) => {
    if(error){
        console.error(`${uniqueId}| ${message}`.red, error);
    } else {
        console.error(`${uniqueId}| ${message}`.red);
    }
}

const setCache = ({ uniqueId, key, value, ttl}) => {
    log({uniqueId, message: `Setting cache for key: ${key} with ttl ${ttl}s`, colour: 'grey'});
    cache.set(key, value, ttl);
}

const getCache = ({ uniqueId, key}) => {
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