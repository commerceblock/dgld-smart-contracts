const HDWalletProvider = require("@truffle/hdwallet-provider"); 

const our_contract_json = require("../../build/contracts/DGLD.json");

const fs = require('fs')

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch(err) {
            return cb && cb(err)
        }
    })
}

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

const our_contract_address="0x9e9F0f8DCD636B0FBBE644649189b4578b4D2eDf"

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



jsonReader('../../build/contracts/DGLD.json', (err, our_contract_json_2) => {
    if (err) {
        console.log(err)
        return
    }

    const our_contract_abi=our_contract_json['abi'];
    
//    console.log("abi:");
//    console.log(our_contract_abi);

    return parseContractAbiAsync(our_contract_abi).then(function(contract) {
	console.log(`Our Contract address:
            ${contract._address}`);

//	    console.log(contract);

	var balance;
	
	contract.methods.name().call()
	    .then(result =>result.toString())
	    .then(result => console.log("name:" + result))
	    .catch(error => console.log(error.message))
	    .then(() => contract.methods.totalSupply().call())
	    .then(result =>result.toString())
	    .then(result => console.log("totalSupply:" + result))
	    .catch(error => console.log(error.message))
	    .then( () => console.log("minting 1000 tokens and getting balance..."))
	    .then(() => web3.eth.getAccounts().then(function(accounts) {
		const addr = accounts[0];
		web3.eth.defaultAccount = addr;
		//Mint tokens to address
		contract.methods.mint(addr,1000).send({from:addr})
		    .catch(error => console.log(error.message))
		    .then(() => balance = contract.methods.balanceOf(addr).call()
			  .then(result => {
			      balance = new BN(result)
			      console.log("balance after minting:" + balance);
			      return balance
			  })
			  .catch(error => console.log(error.message)))
		    .then(() => console.log("sending all DGLD tokens to burn address..."))
		    .then( () => contract.methods.pegoutAddress().call())
		    .then( pegAddr => contract.methods.transfer(pegAddr,balance).send({from:addr}))
		    .catch(error => console.log(error.message))
		    .then(() => contract.methods.totalSupply().call())
		    .then(result => console.log("total supply after sending to burn address:" + result))
		    .catch(error => console.log(error.message))
		    .then(() => contract.methods.balanceOf(addr).call())
		    .then(result => {
			console.log("balance after sending to burn address:" + result);
		    });
		
		
	    //Send all tokens to burn address
//	    
//	    contract.methods.pegoutAddress().call()
//		.then(result => contract.methods.transfer(result,balance).send({from:addr}))
//		.catch(error => console.log(error.message));






	    
	    }))
    }).catch(err => console.log('Failed to parse the contract'));
});
