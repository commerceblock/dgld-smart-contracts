const DGLD = artifacts.require('DGLD');
const tf = require('./testfuncs.js');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Start test block
contract('DGLD high-volume pegin test', accounts => {
    const cpegin = {
	amount: 1000,
	id: "0x6a35c3e032e1bf67d874bc0f008042ce467e0baa2fbb9a1086b6bb247175e9e3"
    }

    const vtotal = {
	peggedIn: 0
    }
    

    it("should only store previous 1000 pegin ids in the contract" , async function() {
	var dgld;

	const nstored=100;
	const ncheck=10;
	var npegs = nstored;
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
	    //dgld.pegin(accounts[5], cpegin.amount, web3.utils.randomHex(32));
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
		await sleep(1);
	    }
	}

	async function doMintPeginLoop(n) {
	    for(let i=0; i<n; i++){
		await doMintPegin();
		await sleep(1);
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

	console.log("pegins:");
	for(var i=1; i<ncheck; i++){
	    console.log("ETH required for " + npegs + " pegins: " + web3.utils.fromWei((balance[i-1]-balance[i]).toString()).toString());		    
	};
 
	result = await dgld.balanceOf.call(accounts[5]);
	assert.equal(
	    result.toNumber(),
	    cpegin.amount * npegs * ncheck,
	    "account[5] has wrong amount"
	);

	await doCheckMintLoop();

	console.log("mints:");
	for(var i=1; i<ncheck; i++){
	    console.log("ETH required for " + npegs + " pegins: " + web3.utils.fromWei((mintBalance[i-1]-mintBalance[i]).toString()).toString());		    
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

    



