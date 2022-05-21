
##### PreRequisites
- Ganache-cli
- Truffle
- node and npm
- Metamask
- Remix IDE


##### Start Ganache-cli and generate 3 accounts
- ganache-cli  --accounts 3 --deterministic --mnemonic="myth like bonus scare over problem client lizard pioneer submit female collect"
##### Deploy the TestToken(Ren Equivalent), PaymentToken(RenBTC equivalent) and the Controller.
- truffle migrate --reset --network development
- After the deployment, copy down the addresses of the 3 contracts for future usage. Go to metamask and switch to Ganache network(port 8845). You can import accounts using mnemonic. Verify if all the three address have eth as 100.
- Once done, you can load the Payment and TestTokens in metamask using their contract addresses. To do this, click on Assets and then Add token and enter the address. Do this for all the 3 accounts and both the tokens.
* You should see 100 dollar in all the 3 accounts. This is done during the deployment stage 

##### Load controller contract on REMIX  
- Switch the network to Web3 provider and connect to Ganache
- Create new file name Controller.sol and paste the entire code.
- compile and load the contract using the Controller address that was saved before.

##### Process
- Create a node using the first account(Only the owner can create node). To do this, Call the createNode() function
- Now collect the funds for Epoch 0, this collection period will last 120 seconds which can be modified if you need some time to test out the functions before the epoch ends. To do this, Use the stakeRen() function. Pass the amount 10000 for 100 dollar and 0 for node 0. Deposit some random amount using the other two accounts. You can test out functions now. getCumulativeNodeDeposit(0) gives total of all the deposits that have been made to node 0), getMyCumulativeNodeDeposit(0) gives the deposit total made to a node by the user calling the function. getCumulativeEpochDeposit(0) gives the total deposits made to the node for the next epoch that is currently accepting deposits. 

- Once the 120 seconds finish, Deposit some more funds. When it reaches 50000 $, node will stop accepting deposits. You can check the status of node which will change from Collectin to registered.
- Now, Run the mockRenVMPayment() by passing 0 for node 0. Here the payment entity for node 0 will recieve rewards of 40000 PayTokens. Do it using first account as only owner can do this.
- Then use the withdrawMyEarnings(0) to get share of the 40000 proportional to the stake that was deposited. You can switch the accounts in Remix and withdraw for other accounts as well.
 
