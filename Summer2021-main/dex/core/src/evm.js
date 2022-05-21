
const ethers = require('ethers');



module.exports = {
  
  getWallet: async function () {
    const wallet = ethers.Wallet.fromMnemonic('pool endless machine pizza target canoe drop obscure jump dad health vapor');
    const provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io/v3/f4f87d14d86f4702a42401261fe65640');
    return wallet.connect(provider);
  },
  UniswapV2Factory: require('../build/contracts/UniswapV2Factory.json')
};
