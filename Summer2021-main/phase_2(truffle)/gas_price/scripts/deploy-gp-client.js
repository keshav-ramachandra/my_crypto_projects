require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const GasPriceClientFactory = new ethers.ContractFactory(
    evm.GasPriceClientArtifact.abi,
    evm.GasPriceClientArtifact.bytecode,
    await evm.getWallet()
  );
  const gasPriceClient = await GasPriceClientFactory.deploy((await evm.getAirnode()).address);
  await gasPriceClient.deployed();
  util.updateLogJson('GasPriceClient address', gasPriceClient.address);
  console.log(`GasPriceClient deployed at address ${gasPriceClient.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
