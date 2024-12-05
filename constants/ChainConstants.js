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

const getInfuraRPCUrl = (chain) => {
    if(chain === "ethereum"){
        return `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
    } else {
        return `https://${chain.toLowerCase()}-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
    }
}

const getSwapContractAddress = (chain) => {
    switch(chain.toLowerCase()){
        case "polygon":
            return "0x4256cCE607E24344d38609861c037815E2626B66";
        case "base":
            return "0x50766859cA7566a2E61F1b5507331cf345b062a9";
        default:
            return null;
    }
}



module.exports = { getChainId, getCoinMarketCapNetworkId, getChainFromCMCNetworkId, SUPPORTED_CHAINS, getInfuraRPCUrl, getSwapContractAddress };