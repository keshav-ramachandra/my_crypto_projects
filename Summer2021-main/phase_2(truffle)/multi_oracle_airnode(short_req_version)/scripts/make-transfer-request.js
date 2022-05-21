require('dotenv').config();
const ethers = require('ethers');
const airnodeAbi = require('@api3/airnode-abi');
const evm = require('../src/evm');
const util = require('../src/util');
const parameters = require('../src/parameters');

let tokenName = 'ethereum';

async function main() {
  const wallet = await evm.getWallet();
  const transferRequestClient = new ethers.Contract(
    util.readFromLogJson('TransferRequestClient address'),
    evm.TransferRequestClientArtifact.abi,
    wallet
  );
  const airnode = await evm.getAirnode();


  const templateId1= await util.createTemplate(
    airnode,
    parameters.providerId,
    parameters.endpointId1, // Example endpointId (randomly generated)
    util.readFromLogJson('Requester index'),
    util.readFromLogJson('Designated wallet address'),
    transferRequestClient.address, // Address of the client that was just deployed
    transferRequestClient.interface.getSighash('fulfill(bytes32,uint256,bytes32)'), // Signature of the function that will be called back
    airnodeAbi.encode([{ name: 'coinId', type: 'bytes32', value: "ethereum" }])
  );
    console.log("created template with templateId, ",templateId1);


  const templateId2= await util.createTemplate(
    airnode,
    parameters.providerId,
    parameters.endpointId2, // Example endpointId (randomly generated)
    util.readFromLogJson('Requester index'),
    util.readFromLogJson('Designated wallet address'),
    transferRequestClient.address, // Address of the client that was just deployed
    transferRequestClient.interface.getSighash('fulfill(bytes32,uint256,bytes32)'), // Signature of the function that will be called back
    airnodeAbi.encode([{ name: 'coinId', type: 'bytes32', value: "ethereum" }])
  );
    console.log("created template2 with templateId2, ",templateId2);

  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

