require('dotenv').config();
const ethers = require('ethers');
const airnodeAbi = require('@api3/airnode-abi');
const evm = require('../src/evm');
const util = require('../src/util');
const parameters = require('../src/parameters');



async function main() {

  
  const wallet = await evm.getWallet();
  const gasPriceClient = new ethers.Contract(
    util.readFromLogJson('GasPriceClient address'),
    evm.GasPriceClientArtifact.abi,
    wallet
  );
  const airnode = await evm.getAirnode();

  const templateId= await util.createTemplate(
    airnode,
    parameters.providerId,
    parameters.endpointId3, // Example endpointId (randomly generated)
    util.readFromLogJson('Requester index'),
    util.readFromLogJson('Designated wallet address'),
    gasPriceClient.address, // Address of the client that was just deployed
    gasPriceClient.interface.getSighash('fulfill(bytes32,uint256,bytes32)'), // Signature of the function that will be called back
    airnodeAbi.encode([])
  );
  
  console.log("created template with templateId, ",templateId);

  async function makeRequest() {
    const receipt = await gasPriceClient.getGasPriceUpdate(
      templateId
    );

    return new Promise((resolve) =>
      wallet.provider.once(receipt.hash, (tx) => {
        const parsedLog = airnode.interface.parseLog(tx.logs[0]);
        resolve(parsedLog.args.requestId);
      })
    );
  }
  const requestId = await makeRequest();
  console.log(`Made the request with ID ${requestId}.\nWaiting for gas price update...`);

  function fulfilled(requestId) {
    return new Promise((resolve) =>
      wallet.provider.once(airnode.filters.ClientRequestFulfilled(null, requestId), resolve)
    );
  }
  await fulfilled(requestId);
  const result = await gasPriceClient.fulfilledData(requestId)
  console.log(`Average gas price is ${(ethers.utils.toUtf8String(result))} `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
