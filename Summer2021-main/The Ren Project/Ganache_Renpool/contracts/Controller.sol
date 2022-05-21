pragma solidity ^0.5.16;


library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }


    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }


    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }


    function mul(uint256 a, uint256 b) internal pure returns (uint256) {



        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }


    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }


    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {

        require(b > 0, errorMessage);
        uint256 c = a / b;


        return c;
    }


    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }


    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}







contract Initializable {


    bool private initialized;


    bool private initializing;


    modifier initializer() {
        require(initializing || isConstructor() || !initialized, "Contract instance has already been initialized");

        bool isTopLevelCall = !initializing;
        if (isTopLevelCall) {
            initializing = true;
            initialized = true;
        }

        _;

        if (isTopLevelCall) {
            initializing = false;
        }
    }


    function isConstructor() private view returns (bool) {





        address self = address(this);
        uint256 cs;
        assembly { cs := extcodesize(self) }
        return cs == 0;
    }


    uint256[50] private ______gap;
}

contract Context is Initializable {


    constructor () internal { }


    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this;
        return msg.data;
    }
}

contract Ownable is Initializable, Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


    function initialize(address sender) public initializer {
        _owner = sender;
        emit OwnershipTransferred(address(0), _owner);
    }


    function owner() public view returns (address) {
        return _owner;
    }


    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }


    function isOwner() public view returns (bool) {
        return _msgSender() == _owner;
    }


    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }


    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }


    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    uint256[50] private ______gap;
}

interface IERC20 {

    function totalSupply() external view returns (uint256);


    function balanceOf(address account) external view returns (uint256);


    function transfer(address recipient, uint256 amount) external returns (bool);


    function allowance(address owner, address spender) external view returns (uint256);


    function approve(address spender, uint256 amount) external returns (bool);


    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);


    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract ERC20Detailed is Initializable, IERC20 {
    string private _name;
    string private _symbol;
    uint8 private _decimals;


    function initialize(string memory name, string memory symbol, uint8 decimals) public initializer {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
    }


    function name() public view returns (string memory) {
        return _name;
    }


    function symbol() public view returns (string memory) {
        return _symbol;
    }


    function decimals() public view returns (uint8) {
        return _decimals;
    }

    uint256[50] private ______gap;
}

contract ERC20 is Initializable, Context, IERC20 {
    using SafeMath for uint256;

    mapping (address => uint256) private _balances;

    mapping (address => mapping (address => uint256)) private _allowances;

    uint256 private _totalSupply;


    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }


    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }


    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }


    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }


    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }


    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }


    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }


    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }


    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _balances[sender] = _balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }


    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }


    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }


    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }


    function _burnFrom(address account, uint256 amount) internal {
        _burn(account, amount);
        _approve(account, _msgSender(), _allowances[account][_msgSender()].sub(amount, "ERC20: burn amount exceeds allowance"));
    }

    uint256[50] private ______gap;
}

library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }


    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }


    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }


    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}

contract PauserRole is Initializable, Context {
    using Roles for Roles.Role;

    event PauserAdded(address indexed account);
    event PauserRemoved(address indexed account);

    Roles.Role private _pausers;

    function initialize(address sender) public initializer {
        if (!isPauser(sender)) {
            _addPauser(sender);
        }
    }

    modifier onlyPauser() {
        require(isPauser(_msgSender()), "PauserRole: caller does not have the Pauser role");
        _;
    }

    function isPauser(address account) public view returns (bool) {
        return _pausers.has(account);
    }

    function addPauser(address account) public onlyPauser {
        _addPauser(account);
    }

    function renouncePauser() public {
        _removePauser(_msgSender());
    }

    function _addPauser(address account) internal {
        _pausers.add(account);
        emit PauserAdded(account);
    }

    function _removePauser(address account) internal {
        _pausers.remove(account);
        emit PauserRemoved(account);
    }

    uint256[50] private ______gap;
}

contract Pausable is Initializable, Context, PauserRole {

    event Paused(address account);


    event Unpaused(address account);

    bool private _paused;


    function initialize(address sender) public initializer {
        PauserRole.initialize(sender);

        _paused = false;
    }


    function paused() public view returns (bool) {
        return _paused;
    }


    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }


    modifier whenPaused() {
        require(_paused, "Pausable: not paused");
        _;
    }


    function pause() public onlyPauser whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }


    function unpause() public onlyPauser whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }

    uint256[50] private ______gap;
}

contract ERC20Pausable is Initializable, ERC20, Pausable {
    function initialize(address sender) public initializer {
        Pausable.initialize(sender);
    }

    function transfer(address to, uint256 value) public whenNotPaused returns (bool) {
        return super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value) public whenNotPaused returns (bool) {
        return super.transferFrom(from, to, value);
    }

    function approve(address spender, uint256 value) public whenNotPaused returns (bool) {
        return super.approve(spender, value);
    }

    function increaseAllowance(address spender, uint256 addedValue) public whenNotPaused returns (bool) {
        return super.increaseAllowance(spender, addedValue);
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public whenNotPaused returns (bool) {
        return super.decreaseAllowance(spender, subtractedValue);
    }

    uint256[50] private ______gap;
}

contract ERC20Burnable is Initializable, Context, ERC20 {

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }


    function burnFrom(address account, uint256 amount) public {
        _burnFrom(account, amount);
    }

    uint256[50] private ______gap;
}

contract RenToken is Ownable, ERC20Detailed, ERC20Pausable, ERC20Burnable {
    string private constant _name = "REN";
    string private constant _symbol = "REN";
    uint8 private constant _decimals = 18;

    uint256 public constant INITIAL_SUPPLY = 1000000000 *
    10**uint256(_decimals);


    constructor() public {
        ERC20Pausable.initialize(msg.sender);
        ERC20Detailed.initialize(_name, _symbol, _decimals);
        Ownable.initialize(msg.sender);
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function transferTokens(address beneficiary, uint256 amount)
    public
    onlyOwner
    returns (bool)
    {


        require(amount > 0);

        _transfer(msg.sender, beneficiary, amount);
        emit Transfer(msg.sender, beneficiary, amount);

        return true;
    }
}

contract Claimable is Initializable, Ownable {
    address public pendingOwner;

    function initialize(address _nextOwner) public initializer {
        Ownable.initialize(_nextOwner);
    }

    modifier onlyPendingOwner() {
        require(
            _msgSender() == pendingOwner,
            "Claimable: caller is not the pending owner"
        );
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(
            newOwner != owner() && newOwner != pendingOwner,
            "Claimable: invalid new owner"
        );
        pendingOwner = newOwner;
    }

    function claimOwnership() public onlyPendingOwner {
        _transferOwnership(pendingOwner);
        delete pendingOwner;
    }
}

library LinkedList {


    address public constant NULL = address(0);


    struct Node {
        bool inList;
        address previous;
        address next;
    }


    struct List {
        mapping (address => Node) list;
    }


    function insertBefore(List storage self, address target, address newNode) internal {
        require(newNode != address(0), "LinkedList: invalid address");
        require(!isInList(self, newNode), "LinkedList: already in list");
        require(isInList(self, target) || target == NULL, "LinkedList: not in list");


        address prev = self.list[target].previous;

        self.list[newNode].next = target;
        self.list[newNode].previous = prev;
        self.list[target].previous = newNode;
        self.list[prev].next = newNode;

        self.list[newNode].inList = true;
    }


    function insertAfter(List storage self, address target, address newNode) internal {
        require(newNode != address(0), "LinkedList: invalid address");
        require(!isInList(self, newNode), "LinkedList: already in list");
        require(isInList(self, target) || target == NULL, "LinkedList: not in list");


        address n = self.list[target].next;

        self.list[newNode].previous = target;
        self.list[newNode].next = n;
        self.list[target].next = newNode;
        self.list[n].previous = newNode;

        self.list[newNode].inList = true;
    }


    function remove(List storage self, address node) internal {
        require(isInList(self, node), "LinkedList: not in list");

        address p = self.list[node].previous;
        address n = self.list[node].next;

        self.list[p].next = n;
        self.list[n].previous = p;



        self.list[node].inList = false;
        delete self.list[node];
    }


    function prepend(List storage self, address node) internal {


        insertBefore(self, begin(self), node);
    }


    function append(List storage self, address node) internal {


        insertAfter(self, end(self), node);
    }

    function swap(List storage self, address left, address right) internal {


        address previousRight = self.list[right].previous;
        remove(self, right);
        insertAfter(self, left, right);
        remove(self, left);
        insertAfter(self, previousRight, left);
    }

    function isInList(List storage self, address node) internal view returns (bool) {
        return self.list[node].inList;
    }


    function begin(List storage self) internal view returns (address) {
        return self.list[NULL].next;
    }


    function end(List storage self) internal view returns (address) {
        return self.list[NULL].previous;
    }

    function next(List storage self, address node) internal view returns (address) {
        require(isInList(self, node), "LinkedList: not in list");
        return self.list[node].next;
    }

    function previous(List storage self, address node) internal view returns (address) {
        require(isInList(self, node), "LinkedList: not in list");
        return self.list[node].previous;
    }

    function elements(List storage self, address _start, uint256 _count) internal view returns (address[] memory) {
        require(_count > 0, "LinkedList: invalid count");
        require(isInList(self, _start) || _start == address(0), "LinkedList: not in list");
        address[] memory elems = new address[](_count);


        uint256 n = 0;
        address nextItem = _start;
        if (nextItem == address(0)) {
            nextItem = begin(self);
        }

        while (n < _count) {
            if (nextItem == address(0)) {
                break;
            }
            elems[n] = nextItem;
            nextItem = next(self, nextItem);
            n += 1;
        }
        return elems;
    }
}

library Address {

    function isContract(address account) internal view returns (bool) {

        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;

        assembly { codehash := extcodehash(account) }
        return (codehash != 0x0 && codehash != accountHash);
    }


    function toPayable(address account) internal pure returns (address payable) {
        return address(uint160(account));
    }


    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");


        (bool success, ) = recipient.call.value(amount)("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}

library SafeERC20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function safeApprove(IERC20 token, address spender, uint256 value) internal {




        require((value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(value);
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).sub(value, "SafeERC20: decreased allowance below zero");
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }


    function callOptionalReturn(IERC20 token, bytes memory data) private {








        require(address(token).isContract(), "SafeERC20: call to non-contract");


        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "SafeERC20: low-level call failed");

        if (returndata.length > 0) {

            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

contract CanReclaimTokens is Claimable {
    using SafeERC20 for ERC20;

    mapping(address => bool) private recoverableTokensBlacklist;

    function initialize(address _nextOwner) public initializer {
        Claimable.initialize(_nextOwner);
    }

    function blacklistRecoverableToken(address _token) public onlyOwner {
        recoverableTokensBlacklist[_token] = true;
    }



    function recoverTokens(address _token) external onlyOwner {
        require(
            !recoverableTokensBlacklist[_token],
            "CanReclaimTokens: token is not recoverable"
        );

        if (_token == address(0x0)) {
            msg.sender.transfer(address(this).balance);
        } else {
            ERC20(_token).safeTransfer(
                msg.sender,
                ERC20(_token).balanceOf(address(this))
            );
        }
    }
}


library Math {

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }


    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }


    function average(uint256 a, uint256 b) internal pure returns (uint256) {

        return (a / 2) + (b / 2) + ((a % 2 + b % 2) / 2);
    }
}

library ERC20WithFees {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;



    function safeTransferFromWithFees(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal returns (uint256) {
        uint256 balancesBefore = token.balanceOf(to);
        token.safeTransferFrom(from, to, value);
        uint256 balancesAfter = token.balanceOf(to);
        return Math.min(value, balancesAfter.sub(balancesBefore));
    }
}





contract Controller{
    
    
    
    struct Epoch{
        uint cumulativeEpochDeposit;
        bool hasOwnerWithdrawn;
        mapping(address => uint) cumulativeUserDeposits;
        // token and their rewards 
        mapping(address => uint) previousEpochEarnings;
    } 
    
    

    struct DNode{
        address darkNodeId;
        bytes publicKey;
        uint expectedNodeOperatonStartTime;
        uint nodeRegistrationTime;
        uint nodeDeRegistrationTime;
        uint registeredEpoch;
        Phase state;
        mapping(uint => Epoch) epochs;
        uint cumulativeNodeDeposit;
        mapping(address => uint) cumulativeUserDeposits;
        address paymentAddress;
    }
    
    enum Phase {Collecting,Registered}
    address public owner;
    uint public nodeCount;
    string[] public supportedTokens = ["renDGB","renDOGE","renBTC","renZEC","renBCH","renFIL","renLUNA"];
    mapping(uint => DNode) public nodes;
    IERC20 public token;
    IERC20 private payToken;
    // parameters for production
    
    /*
    uint public EPOCH_INTERVAL = 2419200;
    uint public NODE_BOND = 100000;
    */
    
    // parameters for Test
    uint public EPOCH_INTERVAL = 120;
    uint public MIN_NODE_BOND = 50000;
    
    //DarknodeRegistryStateV1 private darknodeStateV1;
    //DarknodeRegistryLogicV1 private darknodeLogicV1;
    //DarknodePayment private darknodePayment;
    //address public darknodeProxyAddress;
   

    constructor (IERC20 _token, IERC20 _payToken) public {
        owner = msg.sender;
        token = _token;
        payToken = _payToken;
    }
    
    
     modifier onlyCreator() {
        require(owner == msg.sender,"Controller: Only owner can set a public key for the darknode");
        _;
    }


    function setDarknodeId(uint _nodeId,address _darknodeId) onlyCreator() public returns(bool){
        //check if node number is mapped to a real darknodeId
        require(nodes[nodeCount].darkNodeId == address(0),"Node is already mapped to a darknodeId");
        nodes[nodeCount].darkNodeId = _darknodeId;
        return true;
    }

    function setPublickKey(bytes memory _key) onlyCreator() public returns(bool){
        //check if node number is mapped to a real darknodeId
        require(nodes[nodeCount].darkNodeId != address(0),"Node is not yet mapped to a darknodeId");
        nodes[nodeCount].publicKey = _key;
        return true;
    }
    
    
    
    function createNode() onlyCreator public returns(bool){
        nodeCount = nodeCount + 1;
        nodes[nodeCount-1] = DNode({darkNodeId: address(0),publicKey:"",expectedNodeOperatonStartTime: getNextEpochTime(),nodeRegistrationTime:0,nodeDeRegistrationTime:0,registeredEpoch:0,state:Phase.Collecting, cumulativeNodeDeposit:0,paymentAddress:address(0)});
        nodes[nodeCount-1].paymentAddress = createPaymentEntity();
        return true;
        
    }
    
    
    
    function getEpochforDeposit(uint _nodeId) public view returns(uint){
        if(int(block.timestamp) - int(nodes[_nodeId].expectedNodeOperatonStartTime) < 0){
            return 0;
        }
        else{
            return (block.timestamp - nodes[_nodeId].expectedNodeOperatonStartTime) / EPOCH_INTERVAL + 1;
        }
    } 
    
    
    function getCurrentEpoch(uint _nodeId) public view returns(uint){
        //return ((block.timestamp - nodes[_nodeId].nodeOperatonStartTime) / darknodeStateV1.minimumEpochInterval());
        //require(nodes[_nodeId].expectedNodeOperatonStartTime < block.timestamp,"Epoch count starts after expected Node Operation Time");
        if(block.timestamp < nodes[_nodeId].expectedNodeOperatonStartTime){
            return 0;
        }
        else{
            return (block.timestamp - nodes[_nodeId].expectedNodeOperatonStartTime) / EPOCH_INTERVAL;
        }
    }
    


    
    function getCumulativeNodeDeposit(uint _nodeId) public view returns(uint){
        return nodes[_nodeId].cumulativeNodeDeposit;
    }
    
    function getMyCumulativeNodeDeposit(uint _nodeId) public view returns(uint){
        return nodes[_nodeId].cumulativeUserDeposits[msg.sender];
    }
    
    
    function getCumulativeEpochDeposit(uint _nodeId) public view returns(uint){
        return nodes[_nodeId].epochs[getEpochforDeposit(_nodeId)].cumulativeEpochDeposit;
    }
    
    
    function getMyCumulativeEpochDeposit(uint _nodeId) public view returns(uint){
        return nodes[_nodeId].epochs[getEpochforDeposit(_nodeId)].cumulativeUserDeposits[msg.sender];
    }
    
    function getCumulativeDepositInEpoch(uint _nodeId, uint _epoch)public view returns(uint){
        require(isValidEpoch(_nodeId,_epoch) == true, "Not a valid epoch");
        return nodes[_nodeId].epochs[_epoch].cumulativeEpochDeposit;
    }
    
    function getCumulativeDepositOfUserInEpoch(uint _nodeId, uint _epoch)public view returns(uint){
        require(isValidEpoch(_nodeId,_epoch) == true, "Not a valid epoch");
        return nodes[_nodeId].epochs[_epoch].cumulativeUserDeposits[msg.sender];
    }
    
    function isValidEpoch(uint _nodeId,uint _epoch) public view returns(bool){
        require(_epoch <= getCurrentEpoch(_nodeId),"Specified Epoch has not yet reached");
        return true;
    }
    
    
    
    
    
    
  
    
  
    

    // Accept Ren deposits
    function stakeRen(uint _amount, uint _nodeId) public payable
    {
        require(msg.value == 0, "unexpected ether transfer");
        require(token.balanceOf(msg.sender) >= _amount,"Insufficient balance");
        require(_amount >= 1000,"Minimum deposit is 10 REN");
        uint getExtra=0;
        if(nodes[_nodeId].cumulativeNodeDeposit + _amount > MIN_NODE_BOND){
            getExtra = nodes[_nodeId].cumulativeNodeDeposit + _amount - MIN_NODE_BOND;
        }
        _amount = _amount - getExtra;
        require(_amount > 0,"Node full");
        //require(nodes[_nodeId].cumulativeNodeDeposit + _amount <= MIN_NODE_BOND,"Node bond is complete");
        token.transferFrom(msg.sender, address(this), _amount);
        uint nextEpoch = getEpochforDeposit(_nodeId);
        
        nodes[_nodeId].epochs[nextEpoch].cumulativeEpochDeposit += _amount;
        nodes[_nodeId].epochs[nextEpoch].cumulativeUserDeposits[msg.sender] += _amount;
        
        nodes[_nodeId].cumulativeNodeDeposit += _amount;
        nodes[_nodeId].cumulativeUserDeposits[msg.sender] += _amount;
        
        
        if(isBondSufficient(_nodeId) && (nodes[_nodeId].state == Phase.Collecting)){
            //production
            token.transfer(nodes[_nodeId].paymentAddress, nodes[_nodeId].cumulativeNodeDeposit);
            //require(nodes[_nodeId].darkNodeId != address(0),"Node does not have a public key");
            //darknodeLogicV1.register(nodes[_nodeId].darkNodeId,nodes[_nodeId].publicKey);
            
            nodes[_nodeId].nodeRegistrationTime = block.timestamp;
            nodes[_nodeId].registeredEpoch = getEpochforDeposit(_nodeId);
            nodes[_nodeId].state = Phase.Registered;
        }
    }

    event LogPaymentReceived(address,uint256,IERC20);

   
    function isBondSufficient(uint _nodeId) internal returns(bool){
        //if(nodes[_nodeId].epochs[getEpochforDeposit(_nodeId)].cumulativeNodeDeposit >= darknodeStateV1.minimumBond()){
        if(nodes[_nodeId].cumulativeNodeDeposit >= MIN_NODE_BOND){
            return true;
        }
        else{
            return false;
        }

    }
    
    // production
    /*
    function getNextEpochTime() public view returns(uint256){
        (uint256 _epochhash, uint256 _blocktime) = darknodeStateV1.currentEpoch();
        return _blocktime + darknodeStateV1.minimumEpochInterval();
    }
    */
    
    function getNextEpochTime() public view returns(uint256){
        //(uint256 _epochhash, uint256 _blocktime) = darknodeStateV1.currentEpoch();
        return block.timestamp + EPOCH_INTERVAL;
    }
    
    function getNodeRegistrationTime(uint _nodeId)public view returns(uint){
        require(nodes[_nodeId].state == Phase.Registered,"Node is yet to get registered");
        return nodes[_nodeId].nodeRegistrationTime;
    }
    
    function getDarkNodeRewards(uint _nodeId, address _tokenAddress) public onlyCreator() {
        require(nodes[_nodeId].state == Phase.Registered,"Node is yet to be registered");
        require(getCurrentEpoch(_nodeId) > nodes[_nodeId].registeredEpoch,"At least one payment cycle should be passed"); 
        require(nodes[_nodeId].epochs[getCurrentEpoch(_nodeId)-1].hasOwnerWithdrawn == false, "Funds already withdrawn");
        //require(nodes[_nodeId].payCycles[get] == false,"Payment already done for the current cycle");
        //darknodePayment.withdraw(nodes[_nodeId].darkNodeId,_tokenAddress);
        nodes[_nodeId].epochs[getCurrentEpoch(_nodeId)-1].hasOwnerWithdrawn = true;
    }
    
    
    function getNodeState(uint _nodeId) public view returns(Phase){
        return nodes[_nodeId].state;
    }
    
    
    
   
    function precisionDiv(uint a, uint b, uint precision) public view returns (uint) {
        return a*(10**precision)/b;
    }
    
    
    function getPercentageShare(uint _nodeId) public view returns(uint){
        return precisionDiv(getMyCumulativeNodeDeposit(_nodeId), getCumulativeNodeDeposit(_nodeId), 4);
    }
    
    
    function mockRenVMPayment(uint _nodeId)public onlyCreator(){
        //test only
        require(getCurrentEpoch(_nodeId) > 0,"At least one pay cycle must be passed");
        require(nodes[_nodeId].epochs[getCurrentEpoch(_nodeId)].hasOwnerWithdrawn == false ,"Already withdrawn for epoch");
        payToken.transfer(nodes[_nodeId].paymentAddress, 40000);
        nodes[_nodeId].epochs[getCurrentEpoch(_nodeId)].hasOwnerWithdrawn = true;
        ControllerPaymentEntity cp = ControllerPaymentEntity(nodes[_nodeId].paymentAddress);
        cp.updatePaymentStatusForEpoch(getCurrentEpoch(_nodeId));
        
    }
    


    function createPaymentEntity() private  returns (address) {
        return address(new ControllerPaymentEntity(address(this),token,payToken));
    }
    
    
    function getNodeStakeFromEntity(uint _nodeId) public view returns (uint){
        ControllerPaymentEntity cp = ControllerPaymentEntity(nodes[_nodeId].paymentAddress);
        return cp.getTotalBond();
    }
    
    function getPaymentEntityOfNode(uint _nodeId)public view returns(address){
        return nodes[_nodeId].paymentAddress;
    }
    
    

    function withdrawMyEarnings(uint _nodeId)public returns(bool){
        //get current epoch
        // see if owner has withdrawn funds
        ControllerPaymentEntity cp = ControllerPaymentEntity(nodes[_nodeId].paymentAddress);
        uint balance = cp.getRewardBalance();
        require(balance > 0, "Nothing to withdraw");
        uint myShare = balance * getPercentStakeForEpoch(_nodeId);
        myShare = myShare / 100;
        require(myShare > 0, "Nothing to withdraw");
        cp.makeFundTransfer(msg.sender,myShare);
        return true;
    }
    
    function getRewardPoolBalanceFromEntity(uint _nodeId)public view returns(uint){
        ControllerPaymentEntity cp = ControllerPaymentEntity(nodes[_nodeId].paymentAddress);
        return cp.getRewardBalance();
    }
    
    function getPercentStakeForEpoch(uint _nodeId) public returns(uint){
        require(getCurrentEpoch(_nodeId) > 0,"At least one pay cycle must be passed");
        // Previous UserStake = user cumulative node stake - user current epoch stake
        //  Node stake = cumulative node stake - current epoch stake;
        uint previousUserStake = getMyCumulativeNodeDeposit(_nodeId) - getMyCumulativeEpochDeposit(_nodeId);
        uint previousNodeStake = getCumulativeNodeDeposit(_nodeId) - getCumulativeEpochDeposit(_nodeId);
        uint percentShare = precisionDiv(previousUserStake, previousNodeStake, 4)/100;
        return percentShare;
    }



}

contract ControllerPaymentEntity {
    
    address controller;
    IERC20 testToken;
    IERC20 payToken; 
    uint REWARD_AMOUNT = 40000;
    mapping(uint => bool) hasEpochPaymentRecieved;
    //DarknodeRegistryLogicV1 private darknodeLogicV1;

    constructor(address _controller, IERC20 _testToken,IERC20 _payToken) public {
        controller = _controller;
        testToken = _testToken;
        payToken = _payToken;
        //darknodeLogicV1 = DarknodeRegistryLogicV1(_darknodeProxy);
    }
    
    function registerDarknode(address _darknodeId,bytes memory _publicKey)public returns(bool){
        //darknodeLogicV1.register(_darknodeId,_publicKey);
        return true;
    }
    
    function getControllerAddress() public view returns(address){
        return controller;
    }
    
    function updatePaymentStatusForEpoch(uint _epoch) public {
        require(hasEpochPaymentRecieved[_epoch]== false,"Payment already done by RenVM");
        REWARD_AMOUNT = payToken.balanceOf(address(this));
        hasEpochPaymentRecieved[_epoch] = true;
    }
    

    function getTotalBond() public view returns (uint) {
        return testToken.balanceOf(address(this));
    }
    
    
    
    function getRewardBalance() public view returns(uint){
        return REWARD_AMOUNT;
    }
    
    function makeFundTransfer(address _user,uint _amount)public returns(bool){
        payToken.transfer(_user,_amount);
        return true;
    }
}



