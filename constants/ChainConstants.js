const SUPPORTED_CHAINS = ["ethereum", "polygon", "arbitrum", "base"];

const CHAIN_IDS = {
    "ethereum" : 1,
    "bsc" : 56,
    "polygon" : 137,
    "arbitrum" : 42161,
    "base" : 8453
}

const getChainId = (chain) => {
    return CHAIN_IDS[chain.toLowerCase()];
}

const CMC_NETWORK_DETAILS = [
  {
    id: 1,
    name: "ethereum",
    network_slug: "Ethereum",
  },
  {
    id: 25,
    name: "polygon",
    network_slug: "Polygon",
  },
  {
    id: 14,
    name: "bsc",
    network_slug: "BSC",
  },
  {
    id: 199,
    name: "base",
    network_slug: "Base",
  },
  {
    id: 51,
    name: "arbitrum",
    network_slug: "Arbitrum",
  },
];

const getCoinMarketCapNetworkId = (chain) => {
    return CMC_NETWORK_DETAILS.find((network) => network.network_slug.toLowerCase() === chain.toLowerCase()).id;
}

const getChainFromCMCNetworkId = (id) => {
    return CMC_NETWORK_DETAILS.find((network) => network.id.toString() === id).name.toLowerCase();
}




module.exports = { getChainId, getCoinMarketCapNetworkId, getChainFromCMCNetworkId, SUPPORTED_CHAINS };