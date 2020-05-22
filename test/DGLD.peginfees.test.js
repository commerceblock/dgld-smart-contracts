const DGLD = artifacts.require('DGLD');
const tf = require('./testfuncs.js');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Start test block
contract('DGLD pegin gas fee test', accounts => {
    const cpegin = {
	amount: 1000,
	gas_eth: 0.000914,
	gas_eth_tol:0.000001
	
    }

    const cmint = {
	amount: cpegin.amount,
	gas_eth: 0.000741,
	gas_eth_tol: 0.000001
    }

    const vtotal = {
	peggedIn: 0
    }
    

    it("the expected gas fee should converge to  " + cpegin.gas_eth + "+/-" + cpegin.gas_eth_tol + " per pegin transaction", async function() {
	var dgld;

	const ncheck=5;
	var npegs = 100;
	var balance = [];
	var mintBalance = [];
	
	//Pegin id
	var id = 1;
	var pr;

	var bn = web3.utils.BN;

	dgld = await DGLD.deployed();
    
	var pegCount=0;

	function doPegin(){
	    vtotal.peggedIn += cpegin.amount;
	    dgld.pegin(accounts[5], cpegin.amount, web3.utils.padLeft(web3.utils.numberToHex(pegCount+1),16));
	    pegCount++;
	}

	function doMintPegin(){
	    vtotal.peggedIn += cpegin.amount;
	    dgld.mint(accounts[5], cpegin.amount);
	    pegCount++;
	}

	async function doPeginLoop(n) {
	    for(let i=0; i<n; i++){
		await doPegin();
	    }
	}

	async function doMintPeginLoop(n) {
	    for(let i=0; i<n; i++){
		await doMintPegin();
	    }
	}

	async function doCheckLoop() {
	    for(var j=0; j < ncheck; j++){
		await doPeginLoop(npegs);
		const result = await web3.eth.getBalance(accounts[0]);
		balance[j] = result;
	    }
	}

	async function doCheckMintLoop() {
	    for(var j=0; j < ncheck; j++){
		await doMintPeginLoop(npegs);
		const result = await web3.eth.getBalance(accounts[0]);
		mintBalance[j] = result;
	    }
	}


	await doCheckLoop();

	console.log("ETH used for " + npegs + " pegins per line:");
	for(var i=1; i<ncheck; i++){
	    var gasUsedEth = web3.utils.fromWei((balance[i-1]-balance[i]).toString());
	    var gasPerPegin = gasUsedEth/npegs;
	    if(	i > 1) {
		assert((gasPerPegin - cpegin.gas_eth) < cpegin.gas_eth_tol, "pegins used the wring amount of gas");
	    }
	    console.log(gasUsedEth);		    
	};
 
	result = await dgld.balanceOf.call(accounts[5]);
	assert.equal(
	    result.toNumber(),
	    cpegin.amount * npegs * ncheck,
	    "account[5] has wrong amount"
	);

	await doCheckMintLoop();

	console.log("ETH used for " + npegs + " mints per line:");
	for(var i=1; i<ncheck; i++){
	    var gasUsedEth = web3.utils.fromWei((mintBalance[i-1]-mintBalance[i]).toString());
	    var gasPerPegin = gasUsedEth/npegs;
	    if(	i > 1) {
		assert((gasPerPegin - cmint.gas_eth) < cmint.gas_eth_tol, "mints used the wrong amount of gas");
	    }
	    console.log(gasUsedEth);		    
	};

	result = await dgld.balanceOf.call(accounts[5]);
	assert.equal(
	    result.toNumber(),
	    cpegin.amount * npegs * ncheck * 2,
	    "account[5] has wrong amount"
	);
	
	return true;
    });

});

    



