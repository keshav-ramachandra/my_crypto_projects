pragma solidity >=0.5.16;

import '@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token2 is ERC20Detailed, ERC20 {

    address public owner;

    constructor() ERC20Detailed('Rupee','₹', 2) public{
         owner = msg.sender;
         mint(owner,100000);
    }

    function mint(address account, uint256 amount) public returns (bool) {
        require(msg.sender == owner);
        _mint(account, amount);
        return true;
    }

}
