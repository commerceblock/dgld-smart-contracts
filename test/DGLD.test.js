const DGLD = artifacts.require('DGLD');

//Start test block
contract('DGLD', accounts => {
    const expected = {
	initialSupply: 800000,
	name: "DGLD",
	symbol: "DGLD",
	pegAddress: "0x00000000000000000000000000000000009ddEAd"
    }
	
    const errors = {
	nonMinter: "Error: Returned error: VM Exception while processing transaction: revert MinterRole: caller does not have the Minter role -- Reason given: MinterRole: caller does not have the Minter role.",
	allowance: "Error: Returned error: VM Exception while processing transaction: revert ERC20: transfer amount exceeds allowance -- Reason given: ERC20: transfer amount exceeds allowance."
    }

    var vtotal = {
	minted: 0
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


    const ctransfer = {
	amount: 5000,
    }

    it("should transfer " + ctransfer.amount + " tokens from account 0 to account 1", function() {
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
	    .then(() => dgld.transfer(accounts[1], ctransfer.amount))
	    .then(() =>  dgld.balanceOf.call(accounts[0]))
	    .then(function(result){
		assert.equal(result.toNumber(), account0Initial-ctransfer.amount, 'transfer: accounts[0] balance is wrong');
		return dgld.balanceOf.call(accounts[1]);
	    })
	    .then(function(result){
		assert.equal(result.toNumber(), account1Initial+ctransfer.amount, 'transfer: accounts[1] balance is wrong');
	    })
    });


    it("should fail to transferFrom " + ctransfer.amount + " tokens without allowance", function() {
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
	    .then(() => dgld.transferFrom(accounts[1], accounts[0], ctransfer.amount))
	    .then(() =>  dgld.balanceOf.call(accounts[0]))
	    .then(function(result){
		assert.equal(result.toNumber(), account0Initial, 'transfer: accounts[0] balance is wrong');
		return dgld.balanceOf.call(accounts[1]);
	    })
	    .then(function(result){
		assert.equal(result.toNumber(), account1Initial, 'transfer: accounts[1] balance is wrong');
	    }).catch(function(error) {
		   assert.equal(error.toString(), errors.allowance);
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
//			console.log(isMinter);
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

    const cmint = {
	amount: 10000
    }

    it("should mint " + cmint.amount + " tokens to account[0]", function(){
	var dgld;
	var initialBalance;

	return DGLD.deployed()
	    .then(instance => dgld=instance)
	    .then( () => dgld.balanceOf.call(accounts[0]))
	    .then( result => initialBalance = result.toNumber())
    	    .then( function() {
		vtotal.minted += cmint.amount;
		return dgld.mint(accounts[0], cmint.amount);
	    })
	    .then( () => dgld.balanceOf.call(accounts[0]))
	    .then( result =>
		   assert.equal(result.toNumber(), initialBalance + cmint.amount, 'mint: accounts[0] balance is wrong')
		 );
    });

    it("should fail to mint " + cmint.amount + "tokens from non-minter account[3]", () =>
       {
	   var dgld;
	   return DGLD.deployed()
	       .then(instance => dgld = instance)
	       .then(() => dgld.mint(accounts[3], cmint.amount, { from: accounts[3] }))
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
   
    it("should mint " + cmint.amount + " tokens from account[3] after adding minter role", () =>
       {
	   var dgld;

	   return DGLD.deployed()
	       .then(function(instance) {
		   dgld = instance;
		   dgld.addMinter(accounts[3])
	       })
	       .then(function() {
		   vtotal.minted += cmint.amount;
		   return dgld.mint(accounts[3], cmint.amount, {from: accounts[3]});
		   
	       })
	       .then(() => dgld.balanceOf.call(accounts[3]))
               .then(function(balance) {
		   assert.equal(
		       balance.valueOf(),
		       cmint.amount,
		       "account[3] has wrong amount"
		   )
	       })
       });

    const crenounce = {
	amount: 1
    }

    it("should fail to mint " + crenounce.amount + " token from account[2] after granting then renouncing the minter role",
       function() {
	   var dgld;
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
	       .then(() => dgld.mint(accounts[nAccount], crenounce.amount, {from: accounts[nAccount]}))
	       .then(() => dgld.balanceOf.call(accounts[nAccount]))
               .then(function(balance) {
//		   console.log(balance.toNumber());
//		   console.log(balance);
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
	    .then(instance => dgld.getPegAddress.call())
	    .then(function(result) {
//		console.log("Peg address:");
//		console.log(result);
		return assert.equal(
		    result,
		    expected.pegAddress,
		    "value of getPegAddress() was not "  + expected.pegAdddress);
	    }
		 );
    });


    const cpeg = {
	amount: 500,
	from: 1
    }
    
    it("should send " + cpeg.amount + " from account " + cpeg.from + " to the pegout address",
       function() {
	   var dgld;
	   var initialPegBalance;
	   var finalPegBalance;
	   var initialAccBalance;
	   var finalAccBalance;
	   var pegAddress;
	   return DGLD.deployed()
	       .then(instance => dgld = instance)
	       .then(() => dgld.getPegAddress.call())
	       .then(result => pegAddress = result)
	       .then(() =>  dgld.balanceOf.call(pegAddress))
	       .then(result => initialPegBalance = result.toNumber())
	       .then(() =>  dgld.balanceOf.call(accounts[cpeg.from]))
	       .then(result => initialAccBalance = result.toNumber())
	       .then(() => dgld.transfer(pegAddress, cpeg.amount,
					 {from: accounts[cpeg.from]}))
	       .then(() =>  dgld.balanceOf.call(pegAddress))
	       .then(result => finalPegBalance = result.toNumber())
	       .then(() =>  dgld.balanceOf.call(accounts[cpeg.from]))
	       .then(result => finalAccBalance = result.toNumber())
	       .then(() => assert.equal(finalAccBalance - initialAccBalance,
					-500,
					"account balance should have decreased by " + cpeg.amount))
	       .then(() => assert.equal(finalPegBalance - initialPegBalance,
					500,
					"pegout balance should have increased by " + cpeg.amount));
	   
       });

    function totalSupply() {
	return expected.initialSupply + vtotal.minted;
    }
    
    it("totalSupply() should return the correct number of tokens" , function() {
	var dgld;
	//Ensure that the total supply has been changed
	assert.notEqual(expected.initialSupply, totalSupply(), "total supply has not changed");

	return DGLD.deployed()
	    .then(instance => dgld = instance)
	    .then( () => dgld.totalSupply.call())
	    .then( function(result) {
		let ts=result.toNumber();
//		console.log(ts);
//		console.log(totalSupply);
		return assert.equal(ts,
				    totalSupply(),
				    "totalSupply() amount incorrect: " + ts.toString());
	    });
    });
});
