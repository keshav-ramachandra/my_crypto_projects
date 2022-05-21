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

  

  const GasPriceClientFactory = new ethers.ContractFactory(
    evm.GasPriceClientArtifact.abi,
    evm.GasPriceClientArtifact.bytecode,
    await evm.getWallet()
  );
  const gasPriceClient = await GasPriceClientFactory.deploy((await evm.getAirnode()).address);
  await gasPriceClient.deployed();
  util.updateLogJson('GasPriceClient address', gasPriceClient.address);
  console.log(`GasPriceClient deployed at address ${gasPriceClient.address}`);
  


  
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
