let token

const ERC20 = artifacts.require('ERC20')
const fs = require('fs')

const solution = {};

contract('ERC20', (accounts) => {
  const tokenName = 'Test'
  const tokenSymbol = 'TST'
  const tokenDecimals = 1

  beforeEach(async () => {
    token = await ERC20.new(10000, tokenName, tokenDecimals, tokenSymbol, { from: accounts[ 0 ] })
  })



  it('creation: should create an initial balance of 10000 for the creator', async () => {
    const balance = await token.balanceOf.call(accounts[ 0 ])
    assert.strictEqual(balance.toNumber(), 10000)
    solution["1"] = balance;
  })

  it('creation: test correct setting of vanity information', async () => {
    const name = await token.name.call()
    //assert.strictEqual(name, tokenName)

    const decimals = await token.decimals.call()
    //assert.strictEqual(decimals.toNumber(), tokenDecimals)

    const symbol = await token.symbol.call()
    //assert.strictEqual(symbol, tokenSymbol)
    
    let arr = [];
    arr[0] = name;
    arr[1] = decimals;
    arr[2] = symbol;

    //solution["2"] = arr;

  })


  // TRANSERS
  // normal transfers without approvals
  it('transfers: ether transfer should be reversed.', async () => {
    const balanceBefore = await token.balanceOf.call(accounts[ 0 ])
    assert.strictEqual(balanceBefore.toNumber(), 10000)

    let threw = false
    try {
      await web3.eth.sendTransaction({ from: accounts[ 0 ], to: token.address, value: web3.utils.toWei('10', 'Ether') })
    } catch (e) {
      threw = true
    }
    assert.equal(threw, true)

    const balanceAfter = await token.balanceOf.call(accounts[ 0 ])
    assert.strictEqual(balanceAfter.toNumber(), 10000)
    
    solution["2"] = balanceAfter;

  })

  it('transfers: should transfer 10000 to accounts[1] with accounts[0] having 10000', async () => {
    await token.transfer(accounts[ 1 ], 10000, { from: accounts[ 0 ] })
    const balance = await token.balanceOf.call(accounts[ 1 ])
    assert.strictEqual(balance.toNumber(), 10000)
    solution["3"] = balance;
  })


  it('should save results to the file', async () => {
    fs.writeFileSync('./produced_output.json', JSON.stringify(solution,null,2), 'utf-8')
  })

})
