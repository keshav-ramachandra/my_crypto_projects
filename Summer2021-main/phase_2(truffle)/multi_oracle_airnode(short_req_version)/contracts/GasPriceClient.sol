pragma solidity >=0.6.12;
import "./Ownable.sol";
import "@api3/airnode-protocol/contracts/AirnodeClient.sol";

contract GasPriceClient is AirnodeClient,Ownable{
    
    /*storage*/
    bytes32 public number;
    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => bytes32) public fulfilledData;

    constructor(address airnodeAddress) public AirnodeClient(airnodeAddress){
    }


    
    /*function setting number to user input*/
    function setNumber(bytes32 _number) public {
        number = _number;
    }
    
    /*getter for the number*/
    function getNumber() public view returns (bytes32) {
        return number;
    }

    
    
    function getGasPriceUpdate(bytes32 _template_id) external
    {
        bytes32 requestId = airnode.makeShortRequest(
            _template_id,
            abi.encode(bytes32("1"))
        );
        incomingFulfillments[requestId] = true;
    }


    function fulfill(bytes32 requestId,uint256 statusCode,bytes32 data) external onlyAirnode()
    {
        
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        
        if (statusCode == 0)
        {
            fulfilledData[requestId] = data;
            number = data;
        }

    }
    
    
}
