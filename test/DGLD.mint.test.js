const DGLD = artifacts.require('DGLD');
const tf = require('./testfuncs.js');

contract('DGLD token minting tests', accounts => {
    var vtotal = {
	minted: 0
    }

    function totalSupply() {
	return tf.expected.initialSupply + vtotal.minted;
    }
    
    it("only account[0] should have the minter role initially", function(){
	var dgld;
	
	let chain = DGLD.deployed()
	    .then(instance => dgld = instance);
	
	function checkMinter(acc, index) {
	    if (index == 0) {
		chain = chain.then( () => dgld.isMinter.call(acc))
		    .then( function(result) {
			isMinter = result;
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
	amount: 1000
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

    it("should fail to mint " + cmint.amount + " tokens from non-minter account[3]", () =>
       {
	   var dgld;
	   return DGLD.deployed()
	       .then(instance => dgld = instance)
	       .then(() => dgld.mint(accounts[3], cmint.amount, { from: accounts[3] }))
	       .catch((error) => error)
	       .then(error => tf.requireError(error, tf.errors.nonMinter))
	       .then(() => dgld.balanceOf.call(accounts[3]))
               .then(balance => {
		   assert.equal(
		       balance.valueOf(),
		       0,
		       "account[3] should be empty"
		   )
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
	       .catch((error) => error)
	       .then(error => tf.requireError(error, tf.errors.nonMinter))
	       .then(() => dgld.balanceOf.call(accounts[nAccount]))
               .then(function(balance) {
		   return assert.equal(
		       balance.toNumber(),
		       initialBalance.toNumber(),
		       "account[" + nAccount + "] should not have beeen able to mint tokens"
		   );
	       })
       });

    it("totalSupply() should return the initial supply + the  number of tokens minted" , function() {
	var dgld;
	//Ensure that the total supply has been changed
	assert.notEqual(tf.expected.initialSupply, totalSupply(), "total supply has not changed");

	return DGLD.deployed()
	    .then(instance => dgld = instance)
	    .then( () => dgld.totalSupply.call())
	    .then( function(result) {
		let ts=result.toNumber();
		return assert.equal(ts,
				    totalSupply(),
				    "totalSupply() amount incorrect: " + ts.toString());
	    });
    });
});


