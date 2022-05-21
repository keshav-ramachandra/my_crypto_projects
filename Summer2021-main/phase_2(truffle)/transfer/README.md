
Creating AWS credentials


Go to AWS. Search for IAM and create a user.
Click programmatic access
Attach existing policies
Search for administrator access
Click on next tags
CLick on Next Review
Create User

Once this is done, you can save the access key and secret. 
Go inside the config folder present in the root folder. Copy the example.env file and rename it to .env file and copy paste the credentials we got from AWS.

------------------------------------------------------------------------------------------------

Configure the wallet and provider

Create a .env file in the root folder. 
Copy paste the MNEMONIC of the metamask wallet and the provider URL which in INFURA in our case.
The format can be seen in the example.env file.
 
-----------------------------------------------------------------------------------------------

Perform npm install in the root folder

Compile the smart contracts
npm run build

--------------------------------------------------------------------------------------------------
DEPLOYING AIRNODE


Then we need to specify the API integration and configure the airnode


Go the config folder.
 
Run 
npm run customize-config. This should create a config.json file

Make sure you have docker installed.
Refer here for ubuntu. https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04
On linux, you can use sudo apt install docker

Use sudo on linux to give administrative access if permission is denied
 
sudo docker run -it --rm \
  --env-file .env \
  --env COMMAND=deploy-first-time \
  -v $(pwd):/airnode/out \
  api3/airnode-deployer:pre-alpha

Now, the airnode image should be downloaded locally and deployed

--------------------------------------------------------------------------------------------------

Funding the master wallet

Run 
npm run fund-master-wallet

Now, the master wallet will be funded with 0.1 ether



WAIT FOR A MINUTE BEFORE GOING TO NEXT STEP
-------------------------------------------------------------------------------------------------
Make the end points publicly accessible

Endpoints are not publicly accessible by default, so you will have to make a transaction for this

npm run update-authorizers
----------------------------------------------------------------------------------------------------
CREATE A REQUESTER RECORD

Run the following to create an on-chain requester record. This requester index will be used to endorse clients

npm run create-requester
---------------------------------------------------------------------------------------------------

DEPLOY CLIENTS	

npm run deploy-transfer-request-client



ENDORSE CLIENTS

npm run endorse-transfer-request-client


----------------------------------------------------------------------------------------------------
CREATE A DESIGNATED WALLET
This will be specific for each requester-provider pair

npm run derive-designated-wallet-address

----------------------------------------------------------------------------------------------------
FUND THE DESIGNATED WALLET

npm run fund-designated-wallet
----------------------------------------------------------------------------------------------------
MAKE REQUESTS

To make request, use the remix ide. The deployed contract address can be found in log.json

