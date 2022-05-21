require('dotenv').config();
const ethers = require('ethers');
const airnodeAbi = require('@api3/airnode-abi');
const evm = require('../src/evm');
const util = require('../src/util');
const parameters = require('../src/parameters');

const link = "https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/fc/3034007-inline-i-applelogo.jpg";
let detection = "LOGO_DETECTION";

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
