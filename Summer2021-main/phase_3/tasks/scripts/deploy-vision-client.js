require('dotenv').config();
const ethers = require('ethers');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const VisionClientFactory = new ethers.ContractFactory(
    evm.VisionClientArtifact.abi,
    evm.VisionClientArtifact.bytecode,
    await evm.getWallet()
  );
  const visionClient = await VisionClientFactory.deploy((await evm.getAirnode()).address);
  await visionClient.deployed();
  util.updateLogJson('VisionClient address', visionClient.address);
  console.log(`VisionClient deployed at address ${visionClient.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
