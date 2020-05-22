const DGLD = artifacts.require('wrapped_DGLD');
const tf = require('./testfuncs.js');

contract('DGLD transfer and allowance tests', accounts => {

    const ctransfer = {
	amount: 5000,
	mint: 1000000
    }
    
    it("should transfer " + ctransfer.amount + " tokens from account 0 to account 1", function() {
	var dgld;
	var account0Initial;
	var account1Initial;
     return DGLD.deployed().then(function(instance){
	 dgld = instance;
	 dgld.mint(accounts[0], ctransfer.mint);
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
	 dgld.mint(accounts[0], ctransfer.mint);
     })
	//Transfer some tokkens to accounts[1]
	    .then(() => dgld.transfer(accounts[1], ctransfer.amount))
	//Get the initial balances
	    .then(() =>  dgld.balanceOf.call(accounts[0]))
	    .then(result => account0Initial = result.toNumber())
	    .then(() =>  dgld.balanceOf.call(accounts[1]))
	    .then(result => account1Initial = result.toNumber())
	//Attempt the transferFrom
	    .then(() => dgld.transferFrom(accounts[1], accounts[0], ctransfer.amount))
	//Require the error to be caught
	    .catch((error) => error)
	    .then(error => tf.requireError(error, tf.errors.allowance))
	    .then(() =>  dgld.balanceOf.call(accounts[0]))
	    .then(function(result){
		assert.equal(result.toNumber(), account0Initial, 'transfer: accounts[0] balance is wrong');
		return dgld.balanceOf.call(accounts[1]);
	    })
	    .then(function(result){
		assert.equal(result.toNumber(), account1Initial, 'transfer: accounts[1] balance is wrong');
	    })
    });    

    const vapproval = {
	amount: 100,
	from: 1,
	to: 2,
    };
    
    it("should succeed to transfer no more than " + vapproval.amount + " from another account given approval", function() {
	var dgld;
	var fromInitial;
	var toInitial;
     return DGLD.deployed().then(function(instance){
	 dgld = instance;
	 dgld.mint(accounts[0], ctransfer.mint);
     })
	//Transfer some tokkens to the 'from' account
	    .then(() => dgld.transfer(accounts[vapproval.from], ctransfer.amount))
	//Get the initial balances
	    .then(() =>  dgld.balanceOf.call(accounts[vapproval.from]))
	    .then(result => fromInitial = result.toNumber())
	    .then(() =>  dgld.balanceOf.call(accounts[vapproval.to]))
	    .then(result => toInitial = result.toNumber())
	// Not allowed to spend from someone elses account without approval
	    .then(() => dgld.transferFrom(accounts[vapproval.from], accounts[vapproval.to], vapproval.amount), {from: accounts[vapproval.to]})
	    .catch((error) => error)
	    .then(error => tf.requireError(error, tf.errors.allowance))
	//Approve the allowance
	    .then(() => dgld.approve(accounts[vapproval.to],vapproval.amount, {from: accounts[vapproval.from]}))
	//Check the allowance is correct
	    .then(() => dgld.allowance(accounts[vapproval.from], accounts[vapproval.to]))
	    .then( allowance => assert.equal(allowance.toNumber(), vapproval.amount, "incorrect allowance"))
	// Not allowed to spend more than the approved amount
	    .then(() => dgld.transferFrom(accounts[vapproval.from], accounts[vapproval.to], vapproval.amount + 1), {from: accounts[vapproval.to]})
	    .catch((error) => error)
	    .then(error => tf.requireError(error, tf.errors.allowance))
	// Not allowed to spend more than is in the account
	    .then(() => dgld.transferFrom(accounts[vapproval.from], accounts[vapproval.to], ctransfer.mint + 1), {from: accounts[vapproval.to]})
	    .catch((error) => error)
	    .then(error => tf.requireError(error, tf.errors.balance))
	//Allowed to spend the approved amount
	    .then(() => dgld.transferFrom(accounts[vapproval.from], accounts[vapproval.to], vapproval.amount, {from: accounts[vapproval.to]}))
	//Check the final balances
	    .then(() =>  dgld.balanceOf.call(accounts[vapproval.to]))
	    .then(function(result){
		assert.equal(result.toNumber(),toInitial+vapproval.amount, 'transfer: recipient balance is wrong');
		return dgld.balanceOf.call(accounts[1]);
	    })
	    .then(function(result){
		assert.equal(result.toNumber(), fromInitial-vapproval.amount, 'transfer: sender balance is wrong');
	    })
    });


    it("should increase then decrease allowance by " + vapproval.amount, function() {
	var dgld;
	return DGLD.deployed().then(function(instance){
	    dgld = instance;
	    dgld.mint(accounts[0], ctransfer.mint);
	})
	//Check the allowance is zero
	    .then(() => dgld.allowance(accounts[vapproval.from], accounts[vapproval.to]))
	    .then( allowance => assert.equal(allowance.toNumber(), 0, "incorrect initial allowance"))
	//Increase the allowance and confirm
	    .then(() => dgld.increaseAllowance(accounts[vapproval.to],vapproval.amount, {from: accounts[vapproval.from]}))
	    .then(() => dgld.allowance(accounts[vapproval.from], accounts[vapproval.to]))
	    .then( allowance => assert.equal(allowance.toNumber(), vapproval.amount, "incorrect allowance after increaseAllowance"))
	//Decrease the allowance and confirm
	    .then(() => dgld.decreaseAllowance(accounts[vapproval.to],vapproval.amount, {from: accounts[vapproval.from]}))
	    .then(() => dgld.allowance(accounts[vapproval.from], accounts[vapproval.to]))
	    .then( allowance => assert.equal(allowance.toNumber(), 0, "incorrect allowance after decreaseAllowance"));
    });

    const cpeg = {
	amount: 500,
	from: 1
    }
    
    it("should send " + cpeg.amount + " from account " + cpeg.from + " to the pegout address",
       function() {
	   var dgld;
	   var initialAccBalance;
	   var finalAccBalance;
	   var pegoutAddress;
	   var initialSupply;
	   
	   return DGLD.deployed()
	       .then(instance => dgld = instance)
	       .then(() => dgld.mint(accounts[0], ctransfer.mint))
	       .then( () => dgld.totalSupply.call())
	       .then(result => initialSupply = result)
	       .then(() => dgld.pegoutAddress.call())
	       .then(result => pegoutAddress = result)
	       .then(() =>  dgld.balanceOf.call(accounts[cpeg.from]))
	       .then(result => initialAccBalance = result.toNumber())
	       .then(() => dgld.transfer(pegoutAddress, cpeg.amount,
					 {from: accounts[cpeg.from]}))
	       .then(() =>  dgld.balanceOf.call(accounts[cpeg.from]))
	       .then(result => finalAccBalance = result.toNumber())
	       .then(() => assert.equal(finalAccBalance - initialAccBalance,
					-cpeg.amount,
					"incorrect account balance"))
	       .then(() =>  dgld.balanceOf.call(pegoutAddress))
	       .then(result => assert.equal(result,0,
					    "incorrect pegout address balance"))
	       .then( () => dgld.totalSupply.call())
	       .then( finalSupply => assert.equal(initialSupply-finalSupply, cpeg.amount,
						  "final supply of tokens incorrect"));

	   
       });
});

