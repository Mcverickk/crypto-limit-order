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

const getCoinMarketCapNetworkId = (chain) => {
    return CMC_NETWORK_DETAILS.find((network) => network.network_slug.toLowerCase() === chain.toLowerCase()).id;
}

const getCoinMarketCapNetworkSlug = (chain) => {
    return CMC_NETWORK_DETAILS.find((network) => network.network_slug.toLowerCase() === chain.toLowerCase()).network_slug;
}




module.exports = { getChainId, getCoinMarketCapNetworkId, getCoinMarketCapNetworkSlug };