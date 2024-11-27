import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache();

const setCache = (key, value, ttl) => {
    console.log(`Setting cache for key: ${key}`);
    cache.set(key, value, ttl);
}

const getCache = (key) => {
    console.log(`Getting cache for key: ${key}`);
    return cache.get(key);
}

const getRequest = async (url) => {
    try {
        console.log(`Making GET request to: ${url}`);
        const response = await axios.get(url);
        return { response: response.data };       
    } catch (error) {
        return { error };
    }
}

export { setCache, getCache, getRequest };