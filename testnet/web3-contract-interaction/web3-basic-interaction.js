const HDWalletProvider = require("@truffle/hdwallet-provider"); 

const our_contract_json = require("../../build/contracts/wrapped_DGLD.json");

require('dotenv').config()     

const provider = new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY);

var Web3 = require("web3")
var web3 = new Web3(provider);

web3.eth.net.isListening()
   .then(() => console.log('web3 is connected'))
    .catch(e => console.log('web3 contract not listenting.'));

var BN = web3.utils.BN;

web3.eth.getProtocolVersion().then(function(protocolVersion) {
      console.log(`Protocol Version: ${protocolVersion}`);
})

web3.eth.getGasPrice().then(function(gasPrice) {
      console.log(`Gas Price: ${gasPrice}`);
})

web3.eth.getBlockNumber().then(function(blockNumber) {
      console.log(`Block Number: ${blockNumber}`);
})

const our_contract_address="0x759B3c3E1A93b473D28Be50Fc15A305Ce7ae3990"

web3.eth.getBalance(our_contract_address).then(function(balance) {
      console.log(`Balance of ${our_contract_address}: ${balance} ETH`);
})

//web3.eth.getCode(our_contract_address).then(function(code) {
//      console.log(code);
//})

//console.log(web3);    



//
//})

//var etherscan_url ="https://ropsten.etherscan.io/address/0x89BAcEE55d568bb15b72B624709BE29781e9b87C#code";

var client = require('node-rest-client-promise').Client();

//client.getPromise(etherscan_url)
//    .then((client_promise) => {
//	      console.log(client_promise.data.result);
//    our_contract_abi = JSON.parse(client_promise.data.result);


//our_contract_abi = JSON.parse(dgld_abi);


const parseContractAbiAsync = (our_contract_abi) => {
    return new Promise((resolve, reject) => {
	try {
	    our_contract = new web3.eth.Contract(our_contract_abi,
						 our_contract_address);
            // If all goes well
            resolve(our_contract);
	} catch (ex) {
            // If something goes wrong
            reject(ex);
	}
    })
}



return parseContractAbiAsync(our_contract_json['abi']).then(function(contract) {
    console.log(`Our Contract address:
            ${contract._address}`);
    
    var balance;
    
    contract.methods.name().call()
	.then(result =>result.toString())
	.then(result => console.log("name:" + result))
	.catch(error => console.log(error.message))
	.then(() => contract.methods.totalSupply().call())
	.then(result =>result.toString())
	.then(result => console.log("totalSupply:" + result))
	.catch(error => console.log(error.message))
	.then( () => console.log("pegging in 1000 tokens and getting balance..."))
	.then(() => web3.eth.getAccounts().then(function(accounts) {
	    const addr0 = accounts[0];
	    const addr1 = accounts[0];
	    web3.eth.defaultAccount = addr0;
	    //Pegin tokens to address
	    contract.methods.pegin(addr1,1000,1).send({from:addr0})
		.catch(error => console.log(error.message))
		.then(() => balance = contract.methods.balanceOf(addr1).call()
		      .then(result => {
			  balance = new BN(result)
			  console.log("balance after minting:" + balance);
			  return balance
		      })
		      .catch(error => console.log(error.message)))
		.then(() => console.log("sending all DGLD tokens to burn address..."))
		.then( () => contract.methods.pegoutAddress().call())
		.then( pegAddr => contract.methods.transfer(pegAddr,balance).send({from:addr1}))
		.catch(error => console.log(error.message))
		.then(() => contract.methods.totalSupply().call())
		.then(result => console.log("total supply after sending to burn address:" + result))
		.catch(error => console.log(error.message))
		.then(() => contract.methods.balanceOf(addr1).call())
		.then(result => {
		    console.log("balance after sending to burn address:" + result);
		})
	    
	    
	}))
}).catch(err => console.log('Failed to parse the contract'));    
	      
