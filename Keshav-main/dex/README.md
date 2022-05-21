# Orderbook based Decentralized Exchange 
### How to Run

 - Start Ganache or Ganache cli
 - open Metamask and select ganache network
 - npm install
 - truffle compile
 - truffle migrate --reset --network development
 - npm start 
 - Open http://localhost:3000
 
 #### DEMO 
 
 - Deposit 10 ETH and 10 UNICA tokens into exchange using Account 1
 - Click on sell in the New order section and create a sell order
 - sell amount refers to how much unica tokens you are willing to sell
 - sell price refers to at what price(ETH price) you are willing to sell each UNICA token
 - Choose sell amount as 2 and sell price as 2
 - Now select Account 2 from metamask
 - Deposit 10 ETH amount to exchange.
 - Now click on on the sell order created by account 1. this is present in the order book section. Second account should be debited 4 eth and received 2 UNICA tokens.
 - Once the transaction is successful, you can see the trade in your personal and public section. The sell order will not be available anymore in the orderbook section
 
 
 


