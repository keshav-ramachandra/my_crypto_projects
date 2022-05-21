require('dotenv').config();
const airnodeAdmin = require('@api3/airnode-admin');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const requesterIndex = util.readFromLogJson('Requester index');
  
  //const transferRequestClientAddress = util.readFromLogJson('TransferRequestClient address');
  const transferRequestClientAddress = "0x001c2FC16D05190A8ec1d9719846dbDF3889866a";
  const airnode = await evm.getAirnode();
  await airnodeAdmin.endorseClient(airnode, requesterIndex, transferRequestClientAddress);
  console.log(`Endorsed ${transferRequestClientAddress} by requester with index ${requesterIndex}`);

  

  
  //const gasPriceClientAddress = util.readFromLogJson('GasPriceClient address');
  const gasPriceClientAddress = "0xC55B3c9dbcd4f87F82574e4db5e05ac0587c826a";

  
  await airnodeAdmin.endorseClient(airnode, requesterIndex, gasPriceClientAddress);
  console.log(`Endorsed ${gasPriceClientAddress} by requester with index ${requesterIndex}`);



  //const weatherClientAddress = util.readFromLogJson('WeatherClient address');
  const weatherClientAddress = "0xb29CbE264b5B33dF92c3260cd53962245E0d7D00";

  
  await airnodeAdmin.endorseClient(airnode, requesterIndex, weatherClientAddress);
  console.log(`Endorsed ${weatherClientAddress} by requester with index ${requesterIndex}`);






}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

