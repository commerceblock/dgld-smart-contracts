const DGLD = artifacts.require('DGLD');
const tf = require('./testfuncs.js');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later, showing sleep in a loop...');

  // Sleep in loop
  for (let i = 0; i < 5; i++) {
    if (i === 3)
      await sleep(2000);
    console.log(i);
  }
}

*/

//Start test block
contract('DGLD high-volume pegin test', accounts => {
    const cpegin = {
	amount: 1000,
	id: "0x6a35c3e032e1bf67d874bc0f008042ce467e0baa2fbb9a1086b6bb247175e9e3"
    }

    const vtotal = {
	peggedIn: 0
    }
    

    it("should only store previous 1000 pegin ids in the contract" , function() {
	var dgld;

	const nstored=1000;
	const npegs=nstored*2;
	
	//Pegin id
	var id = 1;
	var pr;

	var bn = web3.utils.BN;
	
	let chain = DGLD.deployed()
	    .then(instance => dgld = instance);

	function doPegin(){
	    chain = chain.then(()=>{
		vtotal.peggedIn += cpegin.amount;
		//	dgld.pegin(accounts[5], cpegin.amount, web3.utils.padLeft(web3.utils.numberToHex(id),16));
		dgld.mint(accounts[5], cpegin.amount);
		id = id+1;
	    }).then(()=>sleep(1))

	}
	
	
	for(var i=0; i<npegs; i++){
	    doPegin();
	}
    
	chain = chain
	    .then(() => dgld.balanceOf.call(accounts[5]))
            .then(function(balance) {
		assert.equal(
		    balance.toNumber(),
		    cpegin.amount * npegs,
		    "account[5] has wrong amount"
		)
	    });


	
	return chain;
    });


    });


