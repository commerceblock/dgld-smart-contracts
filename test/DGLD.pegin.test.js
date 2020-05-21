const DGLD = artifacts.require('DGLD');
const tf = require('./testfuncs.js');

//Start test block
contract('DGLD pegin tests', accounts => {
    const cpegin = {
	amount: 1000,
    }

    const vtotal = {
	peggedIn: 0
    }
    
    it("totalSupply() should return the initial supply + the  number of tokens pegged in" , function() {
	var dgld;
	const id = 1;
	
	return DGLD.deployed()
	    .then(function(instance) {
		dgld = instance;
	    })
	    .then(function() {
		vtotal.peggedIn += cpegin.amount;
		return dgld.pegin(accounts[3], cpegin.amount, id);
	    })
	    .then(() => dgld.balanceOf.call(accounts[3]))
            .then(function(balance) {
		assert.equal(
		    balance.toNumber(),
		    cpegin.amount,
		    "account[3] has wrong amount"
		)
	    })
    });

    it("should fail to pegin with duplicated pegin id" , function() {
	var dgld;
	const id = 1;

	
	return DGLD.deployed()
	    .then(function(instance) {
		dgld = instance;
	    })
	    .then(function() {
		vtotal.peggedIn += cpegin.amount;
		return dgld.pegin(accounts[4], cpegin.amount, id);
	    })
	    .then(function() {
		return dgld.pegin(accounts[4], cpegin.amount, id);
	    })
	    .catch((error) => error)
	    .then(error => tf.requireError(error, tf.errors.pegin))
	    .then(() => dgld.balanceOf.call(accounts[4]))
            .then(function(balance) {
		assert.equal(
		    balance.toNumber(),
		    cpegin.amount,
		    "account[4] has wrong amount"
		)
	    })
    });

    it("should pegin when pegin ids increase incrementally beginning with 1" , function() {
	var dgld;
	
	return DGLD.deployed()
	    .then(function(instance) {
		dgld = instance;
	    })
	    .then(function() {
		vtotal.peggedIn += cpegin.amount;
		return dgld.pegin(accounts[4], cpegin.amount, 0);
	    })
	    .catch((error) => error)
	    .then(error => tf.requireError(error, tf.errors.pegin))
	    .then(function() {
		vtotal.peggedIn += cpegin.amount;
		return dgld.pegin(accounts[4], cpegin.amount, 1);
	    })
	    .then(function() {
		return dgld.pegin(accounts[4], cpegin.amount, 3);
	    })
	    .catch((error) => error)
	    .then(error => tf.requireError(error, tf.errors.pegin))
	    .then(function() {
		return dgld.pegin(accounts[4], cpegin.amount, 2);
	    })
	    .then(() => dgld.balanceOf.call(accounts[4]))
            .then(function(balance) {
		assert.equal(
		    balance.toNumber(),
		    cpegin.amount*2,
		    "account[4] has wrong amount"
		)
	    })
    });
    
    it("pegin() should emit the correct events" , function() {
	var dgld;
	
	//Pegin id
	var pr;
	const id = 1;
	
	return DGLD.deployed()
	    .then(function(instance) {
		dgld = instance;
	    })
	    .then(function() {
		vtotal.peggedIn += cpegin.amount;
		return dgld.pegin(accounts[5], cpegin.amount, id);
	    })
	    .then(response => pr = response)
	    .then(() => tf.assertEventsOfType(pr, ["Transfer", "Pegin"]))
	    .then(() => assert.equal(pr.logs[0].args[0], 0))
	    .then(() => assert.equal(pr.logs[0].args[1], accounts[5]))
	    .then(() => assert.equal(pr.logs[0].args[2], cpegin.amount))
	    .then(() => assert.equal(pr.logs[1].args[0], id))
    });
    
});


