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
  async function makeRequest() {
    const receipt = await gasPriceClient.getGasPriceUpdate(
      parameters.providerId,
      parameters.endpointId3,
      util.readFromLogJson('Requester index'),
      util.readFromLogJson('Designated wallet address'),
      airnodeAbi.encode([])
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
