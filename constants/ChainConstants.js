const CHAIN_IDS = {
    "ethereum" : 1,
    "bsc" : 56,
    "polygon" : 137,
    "arbitrum" : 42161,
    "base" : 8453
}

const getChainId = (chainName) => {
    return CHAIN_IDS[chainName.toLowerCase()];
}

const CMC_NETWORK_DETAILS = [
  {
    id: 1,
    name: "Ethereum",
    network_slug: "Ethereum",
  },
  {
    id: 25,
    name: "Polygon",
    network_slug: "Polygon",
  },
  {
    id: 14,
    name: "BNB Smart Chain (BEP20)",
    network_slug: "BSC",
  },
  {
    id: 199,
    name: "Base",
    network_slug: "Base",
  },
  {
    id: 51,
    name: "Arbitrum",
    network_slug: "Arbitrum",
  },
];

const getCoinMarketCapChainId = (chainName) => {
    return CMC_NETWORK_DETAILS.find((network) => network.network_slug.toLowerCase() === chainName.toLowerCase()).id;
}

const getCoinMarketCapNetworkSlug = (chainName) => {
    return CMC_NETWORK_DETAILS.find((network) => network.network_slug.toLowerCase() === chainName.toLowerCase()).network_slug;
}




module.exports = { getChainId, getCoinMarketCapChainId, getCoinMarketCapNetworkSlug };