require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const WeatherClientFactory = new ethers.ContractFactory(
    evm.WeatherClientArtifact.abi,
    evm.WeatherClientArtifact.bytecode,
    await evm.getWallet()
  );
  const weatherClient = await WeatherClientFactory.deploy((await evm.getAirnode()).address);
  await weatherClient.deployed();
  util.updateLogJson('WeatherClient address', weatherClient.address);
  console.log(`WeatherClient deployed at address ${weatherClient.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
