require('dotenv').config();
const airnodeAdmin = require('@api3/airnode-admin');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const requesterIndex = util.readFromLogJson('Requester index');
  const fullRequestClientAddress = util.readFromLogJson('FullRequestClient address');
  const airnode = await evm.getAirnode();
  await airnodeAdmin.endorseClient(airnode, requesterIndex, fullRequestClientAddress);
  console.log(`Endorsed ${fullRequestClientAddress} by requester with index ${requesterIndex}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

