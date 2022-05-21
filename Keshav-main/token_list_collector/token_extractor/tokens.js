const Web3 = require("web3");
const axios = require("axios");
const request = require('request');

var tokenSet = new Set();


let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/8513919893de43d1afb99be341241a75")
);


let addrs = []

web3.eth.getBlockNumber().then((res) => {
    web3.eth.subscribe('logs', { fromBlock: 0, toBlock:'latest', topics:  ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']},(err,result) => {
        if (!err)
        //console.log(result.address)
        tokenSet.add(result.address)
    })
})


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

setTimeout(() => {
  clearSub()
},360000)

async function clearSub(){
    web3.eth.clearSubscriptions();
    console.log("addresses length is", tokenSet.size)
    
    for(let key of tokenSet){
        let token = key
        let add = 'https://api.ethplorer.io/getTokenInfo/'+token+'?apiKey=EK-3cKyZ-d6PWL99-oEjWE'
        await timeout(2000)
        request(add, function (error, response, body) {
            if(!error){
                if(response.statusCode == 200){
                    var token = JSON.parse(body);
                    axios.post('http://api-server:5000/tokens/insert/', {
                        name: token.name,
                        symbol: token.symbol,
                        description: token.description
                      })
                      .then(function (response) {
                        console.log(response);
                      })
                      .catch(function (error) {
                        //console.log(error);
                      });
                }
            }
        });        
    }
}
