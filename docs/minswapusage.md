# Cardano chain connector via Minswap

Minswap is a multi-pool decentralized exchange operating on the Cardano Blockchain. It provides a platform for users to trade, provide liquidity, and farm tokens.

Minswap connectors are using blockfrost library as a middle layer to connect to Cardano along with lucid-cardano library framework

Currently the MIN-ADA token pair is supported for transaction over Cardano with V1 contracts, other token support would be added soon along with V2 contract support

to effectively use the connector user need to have a blockfrost account and a project created on the required network(preprod/mainnet) and add the project id in cardano.yml file under templates folder

    ** Handling CJS/ESM library dependency**

        As the hummingbot gateway project is CJS package compatible but lucid-cardano and minswap/sdk are ESM package. So in order to make the project build compatible to CJS the lucid-cardano and minswap/sdk libraries were converted to CJS package.

        __Steps__:
        
        Babel is used to convert the compatible CJS package. In package.json we have added a Yarn script to convert.
         Script:
        "babelcompileMinswap": "babel node_modules/@minswap/sdk/build --out-dir node_modules/@minswap/sdk/build/cjs"
        command : yarn babelcompileMinswap
        After conversion modify the package.json under @minswap/sdk as follows,
  
            remove : "type": "module"
            add : "main":"./build/cjs/index.es.js"
            modify : "exports": {
                ".": {
                "types": "./build/index.d.ts",
                "import": "./build/index.es.js"
                }
            }
            to : "exports": {
                ".": "./build/cjs/index.es.js"
            }
  The converted lucid-cardano CJS package is available in lib folder.
        Just copy lucid-cardano folder from lib folder and replace it under node_modules folder.
# Functional use

The Minswap connector is implemented for the following end points:

    1. **/price** = This endpoint is used to get the Buy/Sell price of MIN-ADA pair. The important input parameters  ,
        quote=<token_symbol,MIN>
        base=<token_symbol,ADA>
        amount=<request_amount,number,5>
        
        when, side = BUY
        Expectation: To BUY 5 ADA,  calculate amount of MIN required

        when, side = SELL

        quote=MIN
        base=ADA
        amount=5

        Expectation: When I sell 5 ADA how many MIN can I get in return

        In the response, the values will come in the below output parameters,

        **expectedAmount** : This is the total converted amount as output
        **price** : This is conversion factor

    2. **/trade** = This endpoint is used to place a BUY/SELL order. The same method has been extended to place a Cancel order also specially for Cardano/Minswap. 

        New request parameter introduced as below to support connection to Minswap wallet with Cardano,

        **seedPhrase?**: string; //this is to use wallet seedphrase for Cardano Minswap connection
    
        The important input parameters for BUY/SELL trade,

            quote=<token_symbol,MIN>
            base=<token_symbol,ADA>
            amount=<request_amount,number,5>

            When side BUY, it means : acquire particular requested amount(amount) of base(ADA) by selling  quote(MIN)
            When side SELL, it means: sell particular requested amount(amount) of base(ADA)  to acquire quote(MIN)

        For Cancelling the transaction, the following optional parameters were introduced in TradeRequest interface under amm.requests on top of what the service endpoint already supported for other chains,

        
        **isCancelled?** : boolean;//to identify if to cancel txn for cardano
        **txnHash?**: string; //this is the transaction identifier cancel txn for Cardano  


        The putput transaction id is returned in the **txHash** parameter.  

    3. **/addLiquidity** = This endpoint is used to add liquidity in the specific MIN/ADA  liquidity pool.

    4. **/removeLiquidity** = This endpoint is used to take out(remove) liquidity from the specific MIN/ADA liquidity pool. 
