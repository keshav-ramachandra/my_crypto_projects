echo "installing packages..."
npm install 
echo "compiling the packages..."
yarn run bootstrap 
yarn run build 
yarn run build-all 
cd packages/deployer
echo "removing previous deployment files..."
rm *receipt.json 
echo "configuring serverless with AWS key and secret..."
serverless config credentials -o --provider aws --key <YOUR_AWS_KEY> --secret <YOUR_AWS_SECRET> 
echo "building the deployer files..."
yarn run _build 
cd terraform
echo "removing terraform files..."
rm -rf *.terraform 
terraform init 
cd ..
echo "deploying using terraform..."
node dist/deployer-cli.js deploy-first-time -c ./src/config-data/config.json -s ./src/config-data/security.json 

