const TestToken = artifacts.require("TestToken.sol");
const Controller = artifacts.require("Controller.sol");
const PayToken = artifacts.require("PaymentToken.sol");

module.exports = async function (deployer, network, addresses) {

  let token1Address;
  let token2Address;
  if(network === 'mainnet'){
    token1Address = '';
    token2Address = '';
  } 
  

 await deployer.deploy(TestToken);
await deployer.deploy(PayToken);
const tt = await TestToken.deployed();

const pt = await PayToken.deployed();

token1Address = tt.address;
token2Address = pt.address;
  //await deployer.deploy(Controller,'0x26a45994A7C073Bed62F7005B54933907948245E','0xB07ef6e79F596fE3c2a4924A2144b685d0Ad54D8','0x9954C9F839b31E82bc9CA98F234313112D269712','0x023f2e94C3eb128D3bFa6317a3fF860BF93C1616');
await deployer.deploy(Controller,token1Address,token2Address);



const ctr = await Controller.deployed();
let acts = await web3.eth.getAccounts();
await tt.approve(ctr.address,100000,{from:acts[0]});
await tt.approve(ctr.address,100000,{from:acts[1]});
await tt.approve(ctr.address,100000,{from:acts[2]});
await tt.mint(acts[0],100000,{from:acts[0]});
await tt.mint(acts[1],100000,{from:acts[0]});
await tt.mint(acts[2],100000,{from:acts[0]});
await pt.mint(ctr.address,100000,{from:acts[0]});

};
/*

module.exports = async function (deployer, network, addresses) {



 let token1Address, token2Address;

const UniswapV2FactoryBytecode = require('../build/contracts/UniswapV2Factory.json').bytecode;



const wallet = await evm.getWallet();
const UniswapV2Library = new ethers.ContractFactory(
  [
    "constructor(address _feeToSetter)",
    "function createPair(address tokenA, address tokenB) external returns (address pair)",
  ],
  UniswapV2FactoryBytecode,
  wallet
);




const factory =await UniswapV2Library.deploy(wallet.address);


await deployer.deploy(Token1);
await deployer.deploy(Token2);



const token1 = await Token1.deployed();

const token2 = await Token2.deployed();

const fr =
token1Address = token1.address;
token2Address = token2.address;
fr.createPair(token1Address, token2Address);

};
*/
