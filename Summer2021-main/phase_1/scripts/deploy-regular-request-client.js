require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const RegularRequestClientFactory = new ethers.ContractFactory(
    evm.RegularRequestClientArtifact.abi,
    evm.RegularRequestClientArtifact.bytecode,
    await evm.getWallet()
  );
  const regularRequestClient = await RegularRequestClientFactory.deploy((await evm.getAirnode()).address);
  await regularRequestClient.deployed();
  util.updateLogJson('RegularRequestClient address', regularRequestClient.address);
  console.log(`RegularRequestClient deployed at address ${regularRequestClient.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
