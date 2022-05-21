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

  console.log('Making the request...');

  console.log(airnodeAbi.encode([{ name: 'coinId', type: 'bytes32', value: 'ethereum' }]));
  async function makeRequest() {
    const receipt = await transferRequestClient.makeRequest(0xb37a3f5575f0f15254896963e12b9d8061140920fff1e41327aac96179738de3,0xf466b8feec41e9e50815e0c9dca4db1ff959637e564bb13fefa99e9f9f90453c,177,0x528943166BaDEA81c28c25D39ff447c911031f26,"0x3162000000000000000000000000000000000000000000000000000000000000636f696e49640000000000000000000000000000000000000000000000000000657468657265756d000000000000000000000000000000000000000000000000",30);

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
  console.log(`The value of one ethereum is ${(await transferRequestClient.fulfilledData(requestId) / 10e6 )} cents`);
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

