const UNISWAP_V3_FACTORY_ADDRESS = {
    'base' : '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    'ethereum': '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    'polygon': '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    'arbitrum': '0x1F98431c8aD98523631AE4a59f267346ea31F984',
}

const UNISWAP_V2_FACTORY_ADDRESS = {
    'base' : '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    'ethereum': '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    'polygon': '0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C',
    'arbitrum': '0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9',
}

const UniswapFactoryAddress = ({chain, version}) => {
    switch (version.toLowerCase()) {
        case 'v3':
            return UNISWAP_V3_FACTORY_ADDRESS[chain.toLowerCase()];
        case 'v2':
            return UNISWAP_V2_FACTORY_ADDRESS[chain.toLowerCase()];
        default:
            console.error("Invalid Uniswap version", version);
            return null;
    }
}

module.exports = { UniswapFactoryAddress };