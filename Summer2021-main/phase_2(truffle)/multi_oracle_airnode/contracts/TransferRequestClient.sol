pragma solidity >=0.6.12;
import "./Ownable.sol";
import "./SafeMath.sol";
import "@api3/airnode-protocol/contracts/AirnodeClient.sol";


contract TransferRequestClient is AirnodeClient,Ownable{

    
    using SafeMath for uint256;

    struct User{
        string name;
        string userType;
        bool exists;
    }
    
    //Use and delete
    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => uint) public fulfilledData;
    mapping(bytes32 => address) public dataRecepient;
    mapping(bytes32 => address) public exchangeParty;
    mapping(bytes32 => uint) public amountSent;
    mapping(bytes32 => string) public tokenName;

    //persistent
    mapping(address => mapping(string =>uint)) internal balances;    
    address public creator;
    mapping(address => User) public users;
    address[] public exchangeAddresses;
    mapping (string => bool) isUsernameTaken;


    constructor(address airnodeAddress) public AirnodeClient(airnodeAddress){
        creator = msg.sender;
        balances[creator]["usd"] = 50000 * 1e2; // 50000 dollars in lowesr unit cents
        balances[creator]["btc"] = 1000 * 1e8; // 1000 bitcoins in lowest unit satoshi
        users[creator].name = "admin";
        users[creator].exists = true;
        users[creator].userType = "admin";
    }



    modifier ownerOnly{
        require(msg.sender == creator, "Only owner can invoke this function");
        _;
    }


    modifier ifNameExists(string memory _name){
        require(isUsernameTaken[_name] == false, "Ooops ! Name already exists");
        require(users[msg.sender].exists == false, "Ooops ! Address already registered");
        _;
    }

    modifier isUserRegistered(address _address){
        require(users[_address].exists == true, "Ooops ! User not registered");
        _;
    }

    modifier amountCheck(string memory _currency,uint _amount){
        require(users[msg.sender].exists,"User doesn't exist");
        require(balances[msg.sender][_currency] >= _amount,"insufficient balance");
        _;
    }
    
    
    modifier ethCheck(uint _value){
        require(users[msg.sender].exists,"User doesn't exist");
        require(msg.value >= _value,"insufficient balance");
        _;
    }
    
    

    function registerAsExchange(string memory _name) public ifNameExists(_name) returns(bool) {
        users[msg.sender].name = _name;
        balances[msg.sender]["btc"] = 0;
        balances[msg.sender]["usd"] = 0;
        users[msg.sender].exists = true;
        users[msg.sender].userType = "exchange";
        exchangeAddresses.push(msg.sender);
        return true;
    }

    function registerAsUser(string memory _name) public ifNameExists(_name) returns(bool){
        users[msg.sender].name = _name;
        balances[msg.sender]["btc"] = 0;
        balances[msg.sender]["usd"] = 0;
        users[msg.sender].exists = true;
        users[msg.sender].userType = "user";
        return true;
    }




    function getTokenBalance(string memory _currency) public isUserRegistered(msg.sender) view returns(uint){
        return balances[msg.sender][_currency];
    }
    
    function getEthBalance() public view returns(uint){
        return msg.sender.balance;
    }
    
    



    function transferEth(address payable _receiver) public payable ethCheck(msg.value){
        require(users[msg.sender].exists,"User not registered");
        _receiver.transfer(msg.value);
    }
    
    
    function transferToken(address _receiver, uint _amount, string memory _currency) public payable amountCheck(_currency, _amount){
        require(users[msg.sender].exists,"User not registered");
        balances[msg.sender][_currency] = balances[msg.sender][_currency].sub(_amount);
        balances[_receiver][_currency] = balances[_receiver][_currency].add(_amount);
    }



    function deposit(address _address,uint _amount,string memory _currency) public payable ownerOnly{
        require(balances[creator][_currency]>=_amount,"You don't have sufficient tokens");
        balances[creator][_currency] = balances[creator][_currency].sub(_amount);
        balances[_address][_currency] = balances[_address][_currency].add(_amount);
    }


    function getExchangeList() public view returns(address[] memory){
        return exchangeAddresses;
    }
    
    
    
    function exchangeEthForToken(string memory _token_name,address _exchange_address, bytes32 providerId, bytes32 endpointId, uint requesterInd,address designatedWallet, bytes calldata parameters) public payable isUserRegistered(msg.sender) ethCheck(msg.value){
         bytes32 requestId = airnode.makeFullRequest(
            providerId,
            endpointId,
            requesterInd,
            designatedWallet,
            address(this),
            this.fulfill.selector,
            parameters
        );
        dataRecepient[requestId] = msg.sender;
        tokenName[requestId] = _token_name;
        amountSent[requestId] = msg.value;
        exchangeParty[requestId] = _exchange_address;
        incomingFulfillments[requestId] = true;
    }


    function fulfill(bytes32 requestId,uint256 statusCode,bytes32 data) external onlyAirnode()
    {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        require(statusCode == 0,"Error response");
        uint tokensToSend = uint(data).mul(amountSent[requestId]) / 1e18;
        require(balances[exchangeParty[requestId]][tokenName[requestId]] >= tokensToSend,"The exchange doesn't have sufficient tokens");
        payable(exchangeParty[requestId]).transfer(amountSent[requestId]);
        balances[dataRecepient[requestId]][tokenName[requestId]] = balances[dataRecepient[requestId]][tokenName[requestId]].add(tokensToSend);
        balances[exchangeParty[requestId]][tokenName[requestId]] = balances[exchangeParty[requestId]][tokenName[requestId]].sub(tokensToSend);
        fulfilledData[requestId] = tokensToSend;
        delete dataRecepient[requestId];
        delete tokenName[requestId];
        delete amountSent[requestId];
        delete exchangeParty[requestId];
    }

}

