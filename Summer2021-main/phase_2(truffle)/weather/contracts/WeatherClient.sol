pragma solidity >=0.6.12;
import "./Ownable.sol";
import "@api3/airnode-protocol/contracts/AirnodeClient.sol";

contract WeatherClient is AirnodeClient,Ownable{
    string public place;
    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => bytes32) public fulfilledData;

    constructor(address airnodeAddress) public AirnodeClient(airnodeAddress){
        place = "";
    }

    function setPlace(string memory _place) public {
        place = _place;
    }
    
    function getWeatherUpdate(bytes32 providerId,bytes32 endpointId,uint requesterInd,address designatedWallet,bytes calldata parameters) external
    {
        bytes32 requestId = airnode.makeFullRequest(
            providerId,
            endpointId,
            requesterInd,
            designatedWallet,
            address(this),
            this.fulfill.selector,
            parameters
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
            //place = string(abi.encodePacked(data));
        }

    }
    
    
}
