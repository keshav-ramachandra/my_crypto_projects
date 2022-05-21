require('dotenv').config();
const ethers = require('ethers');
const airnodeAbi = require('@api3/airnode-abi');
const evm = require('../src/evm');
const util = require('../src/util');
const parameters = require('../src/parameters');
let q = process.argv.slice(2)[0];
async function main() {

  


  const wallet = await evm.getWallet();
  const weatherClient = new ethers.Contract(
    util.readFromLogJson('WeatherClient address'),
    evm.WeatherClientArtifact.abi,
    wallet
  );
  const airnode = await evm.getAirnode();
  async function makeRequest() {


    const templateId= await util.createTemplate(
    airnode,
    parameters.providerId,
    parameters.endpointId4, // Example endpointId (randomly generated)
    util.readFromLogJson('Requester index'),
    util.readFromLogJson('Designated wallet address'),
    weatherClient.address, // Address of the client that was just deployed
    weatherClient.interface.getSighash('fulfill(bytes32,uint256,bytes32)'), // Signature of the function that will be called back
    airnodeAbi.encode([{ name: 'key', type: 'bytes32', value: "5fb5f16cb6b14515b1992209210206" },{ name: 'q', type: 'bytes32', value: q }])
  );
    console.log("created template with templateId, ",templateId);



    const receipt = await weatherClient.getWeatherUpdate(
      templateId,
      "5fb5f16cb6b14515b1992209210206",
      q
    );
    return new Promise((resolve) =>
      wallet.provider.once(receipt.hash, (tx) => {
        const parsedLog = airnode.interface.parseLog(tx.logs[0]);
        resolve(parsedLog.args.requestId);
      })
    );
  }
  const requestId = await makeRequest();
  console.log(`Made the request with ID ${requestId}.\nWaiting for weather update from ${q}...`);

  function fulfilled(requestId) {
    return new Promise((resolve) =>
      wallet.provider.once(airnode.filters.ClientRequestFulfilled(null, requestId), resolve)
    );
  }
  await fulfilled(requestId);
  const result = await weatherClient.fulfilledData(requestId)
  console.log(`Weather in ${q} is ${(ethers.utils.toUtf8String(result))} `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
