const EtherWallet = artifacts.require('EtherWallet.sol');

module.exports = function(deployer, network, accounts){
    deployer.deploy(EtherWallet, accounts[0] ); //making the first account as owner
}