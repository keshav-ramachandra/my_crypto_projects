# Preparation: setup and configure

## Creating AWS credentials

- Go to AWS. Search for IAM and create a user.
- Click programmatic access
- Attach existing policies
- Search for administrator access
- Click on next tags
- Click on Next Review
- Create User

Once this is done, you can save the access key and secret. 

Go inside the config folder present in the root folder. Copy the example.env file and rename it to .env file and copy paste the credentials we got from AWS. the two items here are the AWS_ACCESS_KEY (20 bytes) and AWS_SECRET_KEY (40 bytes).

## Configure the wallet and provider

- Create a .env file in the root folder. 
- Copy paste the MNEMONIC of the metamask wallet and the provider URL which in INFURA in our case.
The format can be seen in the example.env file.
 
- Perform npm install in the root folder

  npm install dotenv --save-dev

- Compile and build the smart contracts using this command

  npm run build


# Deploying AirNode and requesting the API

1. We need to specify the API integration and configure the airnode
- Go the config folder. Run 

npm run customize-config

- This should create a config.json file; verify that by "ls" command.

2. Make sure you have docker installed.
Refer here for ubuntu. https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04
On linux, you can use sudo apt install docker

The following command should be run from inside the config folder.
Use sudo on linux to give administrative access if permission is denied
 
sudo docker run -it --rm \
  --env-file .env \
  --env COMMAND=deploy-first-time \
  -v $(pwd):/airnode/out \
  api3/airnode-deployer:pre-alpha
  
  On a personal mac just run the above docker command without sudo.

On successful run, Airnode image should have be downloaded locally and deployed.


## Fund the master wallet

- For Tx fees fund the master wallet; Run
 
npm run fund-master-wallet

Now, the master wallet will be funded with 0.1 ether; You can track with with your 
MetaMask wallet and on Etherscan with your wallet address and AirNode address.


## Make the end points publicly accessible

Endpoints are not publicly accessible by default, so you will have to make a transaction for this

npm run update-authorizers

## Create a requester record

Run the following to create an on-chain requester record. This requester index will be used to endorse clients

npm run create-requester


## Deploy clients

npm run deploy-gp-client


## Endorse clients

npm run endorse-gp-client

## Create a designated wallet

This will be specific for each requester-provider pair

npm run derive-designated-wallet-address

## Fund the designated wallet

npm run fund-designated-wallet

## Make requests

Now, the airnode is ready to accept requests

- Request for getting gas price
 
npm run make-gp-request

- After some elapsed to access AirNode and the API, you should see the gas price.

