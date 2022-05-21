require('dotenv').config();
const hre = require('hardhat');
const evm = require('../src/evm');
const util = require('../src/util');
const airnodeAbi = require('@api3/airnode-abi');
const ethers = require('ethers');

const parameters = require('../src/parameters');

async function main() {


  const coinId = 'bitcoin';
  const airnode = await evm.getAirnode();
  const providerId = parameters.providerId;
  const endpointId = parameters.endpointId;
  const wallet = await evm.getWallet();
  const requesterIndex = util.readFromLogJson('Requester index');
  const designatedWalletAddress = util.readFromLogJson('Designated wallet address');
  const regularRequestClient = new ethers.Contract(
    util.readFromLogJson('RegularRequestClient address'),
    evm.RegularRequestClientArtifact.abi,
    wallet
  );

  


  // https://github.com/api3dao/airnode-admin#create-template
  const templateId= await util.createTemplate(
    airnode,
    providerId,
    endpointId, // Example endpointId (randomly generated)
    '123', // Requester index that was just assigned
    '0x67bc6ed2f24b978a429bd7836790ce70e63be644', // Someone else's designatedWallet
    '0x398aabad0ae5c17cba05a837cf5de9313e973014', // Someone else's fulfillAddress
    '0x52c2ebc9', // Someone else's fulfillFunctionId
    airnodeAbi.encode([{ name: 'coinId', type: 'bytes32', value: coinId }]) // Example template parameters
  );
  console.log("created template with templateId, ",templateId);



  // Now we can trigger a request. Note that in addition to the templateId, the request
  // can include additional parameters encoded in Airnode ABI.
  
  async function makeRequest() {

    const receipt = await regularRequestClient.makeRequest(
      templateId,
      requesterIndex,
      designatedWalletAddress,
      regularRequestClient.address,
      regularRequestClient.interface.getSighash('fulfill(bytes32,uint256,bytes32)'), // Signature of the function that will be called back,
      airnodeAbi.encode([{ name: 'coinId', type: 'bytes32', value: coinId }])

    );

    return new Promise((resolve) =>
        wallet.provider.once(receipt.hash, (tx) => {
          const parsedLog = airnode.interface.parseLog(tx.logs[0]);
          resolve(parsedLog.args.requestId);
        })
    );

  }

  const requestId = await makeRequest();
  console.log(`Made the request with ID ${requestId}.\nWaiting for it to be fulfilled...`);


  function fulfilled(requestId) {
    return new Promise((resolve) =>
      wallet.provider.once(airnode.filters.ClientRequestFulfilled(null, requestId), resolve)
    );
  }
  await fulfilled(requestId);
  console.log('Request fulfilled');
  console.log(`${coinId} price is ${(await regularRequestClient.fulfilledData(requestId)) / 1e6} USD`);
  
  



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });