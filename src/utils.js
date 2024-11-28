const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache();

const setCache = (key, value, ttl) => {
    console.log(`Setting cache for key: ${key}`);
    cache.set(key, value, ttl);
}

const getCache = (key) => {
    console.log(`Getting cache for key: ${key}`);
    return cache.get(key);
}

const getRequest = async ({url, headers}) => {
    try {
        console.log(`Making GET request to: ${url}`);
        const response = await axios.get(url, { headers });
        return { response: response.data };       
    } catch (error) {
        return { error };
    }
}

const postRequest = async ({url, reqBody}) => {
    try {
        console.log(`Making POST request to: ${url}`);
        const response = await axios.post(url, reqBody);
        return { response: response.data };
    } catch (error) {
        return { error };
    }
}

export { setCache, getCache, getRequest, postRequest };