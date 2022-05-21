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


    
    function getWeatherUpdate(bytes32 _template_id,string memory api_key,string memory _place) external
    {
        bytes32 requestId = airnode.makeShortRequest(
            _template_id,
            abi.encode(bytes32("1SS"),
                       bytes32("key"),api_key,
                       bytes32("q"),_place)
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
