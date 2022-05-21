require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const TransferRequestClientFactory = new ethers.ContractFactory(
    evm.TransferRequestClientArtifact.abi,
    evm.TransferRequestClientArtifact.bytecode,
    await evm.getWallet()
  );
  const transferRequestClient = await TransferRequestClientFactory.deploy((await evm.getAirnode()).address);
  await transferRequestClient.deployed();
  util.updateLogJson('TransferRequestClient address', transferRequestClient.address);
  console.log(`TransferRequestClient deployed at address ${transferRequestClient.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
