require('dotenv').config();
const ethers = require('ethers');
const airnodeAbi = require('@api3/airnode-abi');
const evm = require('../src/evm');
const util = require('../src/util');
const parameters = require('../src/parameters');

const link = "https://i.guim.co.uk/img/media/c0e411f5b4c387cd8b275f0794a3618210c5b216/0_339_5081_3048/master/5081.jpg?width=445&quality=45&auto=format&fit=max&dpr=2&s=d68639d367a3123d00c5f219b3622178";
let detection = "LABEL_DETECTION";

const raw = "false";

const content = "";
async function main() {

  


  const wallet = await evm.getWallet();
  const visionClient = new ethers.Contract(
    util.readFromLogJson('VisionClient address'),
    evm.VisionClientArtifact.abi,
    wallet
  );
  const airnode = await evm.getAirnode();
  async function makeRequest() {
    const receipt = await visionClient.getVisionUpdate(
      parameters.providerId,
      parameters.endpointId,
      util.readFromLogJson('Requester index'),
      util.readFromLogJson('Designated wallet address'),
      airnodeAbi.encode([{ name: 'link', type: 'string', value: link },{ name: 'detection', type: 'bytes32', value: detection },{ name: 'raw', type: 'bytes32', value: raw },{ name: 'content', type: 'bytes32', value: content }])
    );
    
    return new Promise((resolve) =>
      wallet.provider.once(receipt.hash, (tx) => {
        const parsedLog = airnode.interface.parseLog(tx.logs[0]);
        resolve(parsedLog.args.requestId);
      })
    );
  }
  const requestId = await makeRequest();
  console.log(`Made the request with ID ${requestId}.\nWaiting for image text...`);

  function fulfilled(requestId) {
    return new Promise((resolve) =>
      wallet.provider.once(airnode.filters.ClientRequestFulfilled(null, requestId), resolve)
    );
  }
  await fulfilled(requestId);
  const result = await visionClient.fulfilledData(requestId)
  console.log(`response is ${(ethers.utils.toUtf8String(result))} `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
