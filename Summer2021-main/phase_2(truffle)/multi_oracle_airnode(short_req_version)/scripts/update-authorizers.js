require('dotenv').config();
const ethers = require('ethers');
const airnodeAdmin = require('@api3/airnode-admin');
const evm = require('../src/evm');
const parameters = require('../src/parameters');

async function main() {
  const airnode = await evm.getAirnode();
  await airnodeAdmin.updateAuthorizers(airnode, parameters.providerId, parameters.endpointId1, [
    ethers.constants.AddressZero,
  ]);
  console.log(`Updated authorizers of endpoint with ID ${parameters.endpointId1} to allow all public requests`);
  

  await airnodeAdmin.updateAuthorizers(airnode, parameters.providerId, parameters.endpointId2, [
    ethers.constants.AddressZero,
  ]);
  console.log(`Updated authorizers of endpoint with ID ${parameters.endpointId2} to allow all public requests`);

   await airnodeAdmin.updateAuthorizers(airnode, parameters.providerId, parameters.endpointId3, [
    ethers.constants.AddressZero,
  ]);
  console.log(`Updated authorizers of endpoint with ID ${parameters.endpointId3} to allow all public requests`);


   await airnodeAdmin.updateAuthorizers(airnode, parameters.providerId, parameters.endpointId4, [
    ethers.constants.AddressZero,
  ]);
  console.log(`Updated authorizers of endpoint with ID ${parameters.endpointId4} to allow all public requests`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
