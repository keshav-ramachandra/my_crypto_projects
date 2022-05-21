require('dotenv').config();
const airnodeAdmin = require('@api3/airnode-admin');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const requesterIndex = util.readFromLogJson('Requester index');
  const visionClientAddress = util.readFromLogJson('VisionClient address');
  //const visionClientAddress = "0x58ff168f33de78A382dF390919B5c363829b4434";

  const airnode = await evm.getAirnode();
  await airnodeAdmin.endorseClient(airnode, requesterIndex, visionClientAddress);
  console.log(`Endorsed ${visionClientAddress} by requester with index ${requesterIndex}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

