require('dotenv').config();
const airnodeAdmin = require('@api3/airnode-admin');
const evm = require('../src/evm');
const util = require('../src/util');

async function main() {
  const requesterIndex = util.readFromLogJson('Requester index');
  
  //const transferRequestClientAddress = util.readFromLogJson('TransferRequestClient address');
  const transferRequestClientAddress = "0x08b98Cb19e260b73E6f040EfedfBF4EeB2BeBD4B";
  const airnode = await evm.getAirnode();
  await airnodeAdmin.endorseClient(airnode, requesterIndex, transferRequestClientAddress);
  console.log(`Endorsed ${transferRequestClientAddress} by requester with index ${requesterIndex}`);

  

  
  const gasPriceClientAddress = util.readFromLogJson('GasPriceClient address');
  //const gasPriceClientAddress = "0x58ff168f33de78A382dF390919B5c363829b4434";

  
  await airnodeAdmin.endorseClient(airnode, requesterIndex, gasPriceClientAddress);
  console.log(`Endorsed ${gasPriceClientAddress} by requester with index ${requesterIndex}`);



  const weatherClientAddress = util.readFromLogJson('WeatherClient address');
  //const weatherClientAddress = "0x58ff168f33de78A382dF390919B5c363829b4434";

  
  await airnodeAdmin.endorseClient(airnode, requesterIndex, weatherClientAddress);
  console.log(`Endorsed ${weatherClientAddress} by requester with index ${requesterIndex}`);






}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

