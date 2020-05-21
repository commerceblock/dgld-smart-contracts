const DGLD = artifacts.require('DGLD');
const tf = require('./testfuncs.js');

//Start test block
contract('DGLD pegin tests', accounts => {
    const cpegin = {
	amount: 1000,
	id: "0x6a35c3e032e1bf67d874bc0f008042ce467e0baa2fbb9a1086b6bb247175e9e3"
    }

    const vtotal = {
	peggedIn: 0
    }
    
    it("totalSupply() should return the initial supply + the  number of tokens pegged in" , function() {
	var dgld;

	//Pegin id
	var id;
	
	return DGLD.deployed()
	    .then(function(instance) {
		dgld = instance;
		id = web3.utils.randomHex(32);
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
	
	return DGLD.deployed()
	    .then(function(instance) {
		dgld = instance;
	    })
	    .then(function() {
		vtotal.peggedIn += cpegin.amount;
		return dgld.pegin(accounts[4], cpegin.amount, cpegin.id);
	    })
	    .then(function() {
		return dgld.pegin(accounts[4], cpegin.amount, cpegin.id);
	    })
	    .catch((error) => error)
	    .then(error => tf.requireError(error, tf.errors.pegindupe))
	    .then(() => dgld.balanceOf.call(accounts[4]))
            .then(function(balance) {
		assert.equal(
		    balance.toNumber(),
		    cpegin.amount,
		    "account[4] has wrong amount"
		)
	    })
    });
    
    it("pegin() should emit the correct events" , function() {
	var dgld;
	
	//Pegin id
	var id;
	var pr;
	
	return DGLD.deployed()
	    .then(function(instance) {
		dgld = instance;
		id = web3.utils.randomHex(32);
	    })
	    .then(function() {
		vtotal.peggedIn += cpegin.amount;
		return dgld.pegin(accounts[4], cpegin.amount, id);
	    })
	    .then(response => pr = response)
	    .then(() => tf.assertEventsOfType(pr, ["Transfer", "Pegin"]))
	    .then(() => assert.equal(pr.logs[0].args[0], 0))
	    .then(() => assert.equal(pr.logs[0].args[1], accounts[4]))
	    .then(() => assert.equal(pr.logs[0].args[2], cpegin.amount))
	    .then(() => assert.equal(pr.logs[1].args[0], id))
    });
    
});


