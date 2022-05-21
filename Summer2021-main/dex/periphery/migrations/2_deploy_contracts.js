const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol");

module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS ='0x1eD9595f37188be5144e1F727772DE4e6C9AA65E';
  const WETH_ADDRESS ='0x5AD39A56D3DE6f56062fa5E730aF06A000Db50d8';
  /*
  if(network === 'mainnet'){
      weth = await WETH.at('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');

  }
  */


  await deployer.deploy(Router, FACTORY_ADDRESS, WETH_ADDRESS);
};
