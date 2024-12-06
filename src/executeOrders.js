const Config = require("../config");
const { updateLimitOrder } = require("./cryptoUtils");
const { fetchActiveOrdersFromHasura } = require("./fetchActiveOrders");
const { log, setCache, getCache } = require("./utils");
const { ethers } = require('ethers');
const SwapContractABI = require('../constants/SwapContractABI.json');

const executeOrders = async ({uniqueId, orders}) => {
    if(orders.length === 0){
        return;
    }
    const executedOrders = [];

    for(let i = 0; i < orders.length; i++){
        const order = orders[i];
        const { id, triggerPrice, executionData, amount, chain, walletAddress, fromTokenData, toTokenData } = order;
        const { dex, name, price } = executionData;
        log({ uniqueId, message: `Executing order ${id} for ${name} at price ${price}` });

        let txnHash = getCache({ uniqueId, key: id + '-txnHash' });
        if(!txnHash){
            const { txnReceipt, error: executeContractError } = await executeSwapContract({uniqueId, chain, fromTokenData, toTokenData, amount, walletAddress, triggerPrice});
            
            if(executeContractError || !txnReceipt){
                log({ uniqueId, message: `Error executing swap contract: ${executeContractError.message}`, colour: 'bgRed' });
                continue;
            }

            txnHash = txnReceipt.hash;
            log({ uniqueId, message: `Executed order ${id} with txnHash: ${txnHash}`, colour: 'bgBrightGreen' });
        }

        const { error } = await updateLimitOrder({ uniqueId, id, status: 'COMPLETED', dex, txnHash });

        if(error){
            setCache({ uniqueId, key: id + '-txnHash', value: txnReceipt.hash, ttl: 86400 });
            log({ uniqueId, message: `Error updating order ${id} to COMPLETED`, colour: 'bgRed' });
        }

        executedOrders.push(id);
    }
    
    log({ uniqueId, message: `Executed orders: [${executedOrders.join(',')}]`, colour: 'brightGreen' });
    if(executedOrders.length > 0){
        await fetchActiveOrdersFromHasura({ uniqueId });
    }
}


const executeSwapContract = async ({uniqueId, chain, fromTokenData, toTokenData, amount, triggerPrice, walletAddress}) => {
    try{
        provider = new ethers.JsonRpcProvider(Config.getRPCUrlForChain(chain));
        const signer = new ethers.Wallet(Config.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(Config.getSwapContractAddress(chain), SwapContractABI, signer);
    
        const amountIn = BigInt(Math.floor(amount * 10**fromTokenData.decimals));
        const amountOutMin = BigInt(Math.floor(amount * triggerPrice * 10**toTokenData.decimals));

        let tx;

        if(fromTokenData.address === Config.ZERO_ADDRESS){
            tx = await contract.swapCoinToToken(toTokenData.address, 3000, amountIn, amountOutMin, walletAddress);
        } else if(toTokenData.address === Config.ZERO_ADDRESS){
            tx = await contract.swapTokenToCoin(fromTokenData.address, 3000, amountIn, amountOutMin, walletAddress);
        } else {
            tx = await contract.swapTokenToToken(fromTokenData.address, toTokenData.address, 3000, amountIn, amountOutMin , walletAddress);
        }
    
        const txnReceipt = await tx.wait();

        return { txnReceipt };

    } catch (error){
        return { error };
    }
}



module.exports = { executeOrders };