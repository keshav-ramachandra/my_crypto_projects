require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const ShortRequestClientFactory = new ethers.ContractFactory(
    evm.ShortRequestClientArtifact.abi,
    evm.ShortRequestClientArtifact.bytecode,
    await evm.getWallet()
  );
  const shortRequestClient = await ShortRequestClientFactory.deploy((await evm.getAirnode()).address);
  await shortRequestClient.deployed();
  util.updateLogJson('ShortRequestClient address', shortRequestClient.address);
  console.log(`ShortRequestClient deployed at address ${shortRequestClient.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
