const EtherWallet = artifacts.require('EtherWallet.sol');
const {expectRevert} = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');


contract('EtherWallet', (accounts)=> {
    let ethWallet = undefined;

    beforeEach(async ()=>{
        ethWallet = await EtherWallet.deployed();
    })

    it('should set accounts[0] as the owner', async()=>{
        let _owner = await ethWallet.owner();
        assert(_owner === accounts[0]);
    })

    it('should deposit ether to the smart contract', async()=>{
        await ethWallet.deposit({
            from:accounts[1],
            value: web3.utils.toWei('5','ether')
        });

        const balance = await ethWallet.balanceOf();
        assert(balance.toString() === web3.utils.toWei('5','ether'));
    })

    it('should correctly show the balance of the wallet', async()=>{
        const balance = await web3.eth.getBalance(ethWallet.address);
        console.log(web3.utils.toWei('5','ether'));
        assert(balance === web3.utils.toWei('5','ether'));
    })

    it('should send ether to another address', async()=>{
        let initialBalance = await web3.eth.getBalance(accounts[1]);
        await ethWallet.send(
            accounts[1],
            web3.utils.toWei('2','ether'),
            {from:accounts[0]}            
        );

        let contractBalance = await web3.eth.getBalance(ethWallet.address);
        assert(contractBalance === web3.utils.toWei('3','ether'));
        let afterBalance = await web3.eth.getBalance(accounts[1]);
        let afterBN = web3.utils.toBN(afterBalance);        
        let beforeBN = web3.utils.toBN(initialBalance);
        assert(afterBN.sub(beforeBN).toString() === web3.utils.toWei('2','ether'));
    })
    
    it('only owner can send', async()=>{
        await expectRevert(
            ethWallet.send(accounts[3],10000,{from: accounts[2]}),
            "Only Owner can end"
        );
    })

})