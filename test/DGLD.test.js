const DGLD = artifacts.require('DGLD');

//Start test block
contract('DGLD', accounts => {
    const expected = {
	initialSupply: 800000,
	name: "DGLD",
	symbol: "DGLD",
	pegAddress: "0x00000000000000000000000000000000009ddEAd",
	minterAccounts: [1,0,0,0,0,0,0,0,0,0]
    }

    const errors = {
	nonMinter: "Error: Returned error: VM Exception while processing transaction: revert MinterRole: caller does not have the Minter role -- Reason given: MinterRole: caller does not have the Minter role."
    }

    
    it("initialSupply() should return " + expected.initialSupply.toString(), function()
       {
	   return DGLD.deployed()
	       .then(instance => dgld=instance)
	       .then(() => dgld.initialSupply.call())
	       .then(result =>
		   assert.equal(
		   result.toNumber(),
		   expected.initialSupply,
		       "initialSupply() was not "  + expected.initialSupply.toString()))
		    
       }
      );

    it("should put " + expected.initialSupply + " tokens in account[0] initially", function() {
	var dgld;
	return DGLD.deployed().then(function(instance){
	    dgld=instance;
	})
	    .then(() =>  dgld.balanceOf.call(accounts[0]))
	    .then(function(balance) {
//		console.log(balance);
		return assert.equal(
		    balance.toNumber(),
		    expected.initialSupply,
		    expected.initialSupply.toString() + " was not in account[0]"
		);
	    })
    }
      );


    const nToTransfer = 500000;
    it("should transfer " + nToTransfer + " dgld from account 0 to account 1", function() {
	var dgld;
	var account0Initial;
	var account1Initial;
     return DGLD.deployed().then(function(instance){
	 dgld = instance;
     })
	    .then(() =>  dgld.balanceOf.call(accounts[0]))
	    .then(result => account0Initial = result.toNumber())
	    .then(() =>  dgld.balanceOf.call(accounts[1]))
	    .then(result => account1Initial = result.toNumber())
	    .then(() => dgld.transfer(accounts[1], nToTransfer))
	    .then(() =>  dgld.balanceOf.call(accounts[0]))
	    .then(function(result){
		assert.equal(result.toNumber(), account0Initial-nToTransfer, 'transfer: accounts[0] balance is wrong');
		return dgld.balanceOf.call(accounts[1]);
	    })
	    .then(function(result){
		assert.equal(result.toNumber(), account1Initial+nToTransfer, 'transfer: accounts[1] balance is wrong');
	    })
    });
    
    it("only account[0] should have the minter role initially", function(){
	var dgld;

	let chain = DGLD.deployed()
	    .then(instance => dgld = instance);

	function checkMinter(acc, index) {
	    if (index == 0) {
		chain = chain.then( () => dgld.isMinter.call(acc))
		    .then( function(result) {
			isMinter = result;
			console.log(isMinter);
			return assert.equal(isMinter,
					    true,
					    "account[0] should be a minter.");
		    });
	    } else {
		chain=chain
		    .then(() => dgld.isMinter.call(acc))
		    .then( function(result) {
			return assert.equal(result,
					    false,
					    "account[" + index + "] should not be a minter.");
		    })
	    }
	}
	    
	accounts.forEach(checkMinter);

	return chain;
    });


    it("should mint 10000 tokens to account[0]", function(){
	var dgld;
	var initialBalance;
	var nToMint=10000;
	return DGLD.deployed()
	    .then(instance => dgld=instance)
	    .then( () => dgld.balanceOf.call(accounts[0]))
	    .then( result => initialBalance = result.toNumber())
    	    .then( () => dgld.mint(accounts[0], nToMint))
	    .then( () => dgld.balanceOf.call(accounts[0]))
	    .then( result =>
		   assert.equal(result.toNumber(), initialBalance + nToMint, 'mint: accounts[0] balance is wrong')
		 );
    });
       

    it("should fail to mint 10000 tokens from non-minter account[3]", () =>
       {
	   var dgld;
	   var nToMint=10000;	   
	   return DGLD.deployed()
	       .then(instance => dgld = instance)
	       .then(() => dgld.mint(accounts[3], nToMint, { from: accounts[3] }))
	       .then(() => dgld.balanceOf.call(accounts[3]))
               .then(balance => {
		   assert.equal(
		       balance.valueOf(),
		       1,
		       "account[3] should be empty"
		   )
	       }).catch(function(error) {
		   assert.equal(error.toString(), errors.nonMinter);
	       })
       });
   
    it("should mint 10000 tokens from account[3] after adding minter role", () =>
       {
	   var dgld;
	   var nToMint=10000;

	   return DGLD.deployed()
	       .then(function(instance) {
		   dgld = instance;
		   dgld.addMinter(accounts[3])
	       })
	       .then(() => dgld.mint(accounts[3], nToMint, {from: accounts[3]}))
	       .then(() => dgld.balanceOf.call(accounts[3]))
               .then(function(balance) {
		   assert.equal(
		       balance.valueOf(),
		       nToMint,
		       "account[3] has wrong amount"
		   )
	       })
       });


    it("should fail to mint 10000 tokens from account[2] after granting then revoking the minter role",
       function() {
	   var dgld;
	   var nToMint=10000;
	   var nAccount=2;
	   var initialBalance;
	   return DGLD.deployed()


	       .then(function(instance) {
		   dgld = instance;
		   return dgld.balanceOf.call(accounts[nAccount]);
	       })
	       .then( result => initialBalance = result)
	       .then(() => dgld.addMinter(accounts[nAccount], {from: accounts[0]}))
	       .then(() => dgld.isMinter.call(accounts[nAccount]))
	       .then( result => assert.equal(result, true, "account[" + nAccount + "] should be a minter"))
	       .then( () => dgld.renounceMinter({from: accounts[nAccount]}))
	       .then(() => dgld.isMinter.call(accounts[nAccount]))
	       .then( result => assert.equal(result, false, "account[" + nAccount + "] should not be a minter"))
	       .then(() => dgld.mint(accounts[nAccount], nToMint, {from: accounts[nAccount]}))
	       .then(() => dgld.balanceOf.call(accounts[nAccount]))
               .then(function(balance) {
		   console.log(balance.toNumber());
		   console.log(balance);
		   return assert.equal(
		       balance.toNumber(),
		       initialBalance.toNumber(),
		       "account[" + nAccount + "] should not have beeen able to mint tokens"
		   );
	       })
       .catch(function(error) {
		   assert.equal(error.toString(), errors.nonMinter);
       })
       });
      


    it("getPegAddress() should return " + expected.pegAddress.toString(), function() {
	return DGLD.deployed()
	    .then(instance=> dgld.getPegAddress.call())
	    .then(function(result) {
		console.log("Peg address:");
		console.log(result);
		return assert.equal(
		    result,
		    expected.pegAddress,
		    "value of getPegAddress() was not "  + expected.pegAdddress);
	    }
		 );
    });


});
