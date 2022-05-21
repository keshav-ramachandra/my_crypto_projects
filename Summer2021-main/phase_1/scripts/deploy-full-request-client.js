require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const FullRequestClientFactory = new ethers.ContractFactory(
    evm.FullRequestClientArtifact.abi,
    evm.FullRequestClientArtifact.bytecode,
    await evm.getWallet()
  );
  const fullRequestClient  = await FullRequestClientFactory.deploy((await evm.getAirnode()).address);
  await fullRequestClient.deployed();
  util.updateLogJson('FullRequestClient address', fullRequestClient.address);
  console.log(`FullRequestClient deployed at address ${fullRequestClient.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
