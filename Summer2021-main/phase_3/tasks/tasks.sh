#!/bin/sh



echo "removing the previous run files..."
rm log.json 
rm ./config/*.receipt.json
echo "copying receipt"
cp ../vision_node/packages/deployer/*.receipt.json ./config/
echo "installing the packages..."
npm install 
echo "compile the smart contracts..."
npm run build 
cd config
echo "funding the master wallet..."
npm run fund-master-wallet 
echo "waiting for 90sec..."
sleep 90s

echo "authorize endpoints for public access..."
npm run update-authorizers 
echo "create requester..."
npm run create-requester 
echo "deploy the vision smart contract..."
npm run deploy-vision-client
echo "endorsing the vision smart contract..."
npm run endorse-vision-client
echo "deriving the designated wallet address using provider and requester id..."
npm run derive-designated-wallet-address 
echo "funding the designated wallet..."
npm run fund-designated-wallet 
echo "requesting for text extraction by passing image Uri..."
npm run make-vision-request

