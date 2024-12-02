# Crypto Limit Order

## Project Overview
This project is a crypto limit order application that allows users to place buy and sell orders for cryptocurrencies at specified prices. The application ensures that orders are executed only when the market price meets the specified limit price.

## Logic Implementation
1. **Order Placement:**
    - Users can place buy or sell orders with a specified limit price.
    ```
    curl --location 'http://localhost:3000/limit-order/create' \
        --header 'Content-Type: application/json' \
        --data '{
        "chain": "polygon",
        "triggerPrice": 3650,
        "type": "BUY",
        "walletAddress": "0xD43ABDA398A684b25595b5460A8040005d69d32d",
        "fromTokenData": {
            "symbol": "WETH",
            "decimals": 18,
            "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
        },
        "toTokenData": {
            "symbol": "USDC",
            "decimals": 6,
            "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
        }
        }
        '
    ```

2. **Order Matching:**
    - The application fetches the active orders from database.
    - It computes the pool addresses for the orders.
    - It fetches the pool data for all the uniques pool addresses and caches it.
    - It then checks the order for execution. If the order is not to be executed, it calculates the order cache time for which the price data can be stale for that order.
    - It caches the order with its particular cache time.

3. **Order Execution:**
    - When the execution conditions are met, the order transaction is then simulated and sent to the blockchain.

4. **User Interface:**
    - A simple web interface allows users to place, view and cancel their orders.

5. **View Orders:**
    - To view all the orders for an address
    ```
    curl --location 'http://localhost:3000/limit-order/address/chiragagarwal.eth'
    ```
