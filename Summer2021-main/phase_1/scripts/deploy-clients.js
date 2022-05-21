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


  const RegularRequestClientFactory = new ethers.ContractFactory(
    evm.RegularRequestClientArtifact.abi,
    evm.RegularRequestClientArtifact.bytecode,
    await evm.getWallet()
  );
  const regularRequestClient = await RegularRequestClientFactory.deploy((await evm.getAirnode()).address);
  await regularRequestClient.deployed();
  util.updateLogJson('RegularRequestClient address', regularRequestClient.address);
  console.log(`RegularRequestClient deployed at address ${regularRequestClient.address}`);


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
