const DGLD = artifacts.require('wrapped_DGLD');
const tf = require('./testfuncs.js');

contract('DGLD constants and initialization test', accounts => {

    it("name should be " + tf.expected.name, function() {
	return DGLD.deployed()
	    .then(instance => instance.name.call())
	    .then( name => assert.equal(name, tf.expected.name, "incorrect name"));
    });

    it("symbol should be " + tf.expected.symbol, function() {
	return DGLD.deployed()
	    .then(instance => instance.symbol.call())
	    .then( symbol => assert.equal(symbol, tf.expected.symbol, "incorrect symbol"));
    });

    it("decimals should be " + tf.expected.decimals, function() {
	return DGLD.deployed()
	    .then(instance => instance.decimals.call())
	    .then( decimals => assert.equal(decimals, tf.expected.decimals, "incorrect decimals"));
    });
        
    it("initialSupply() should return " + tf.expected.initialSupply.toString(), function()
       {
	   return DGLD.deployed()
	       .then(instance => instance.initialSupply.call())
	       .then(result =>
		   assert.equal(
		   result.toNumber(),
		       tf.expected.initialSupply,
		       "initialSupply() was not "  + tf.expected.initialSupply.toString()))
	   
       }
      );

    it("should put " + tf.expected.initialSupply + " tokens in account[0] initially", function() {
	var dgld;
	return DGLD.deployed().then(function(instance){
	    dgld=instance;
	})
	    .then(() =>  dgld.balanceOf.call(accounts[0]))
	    .then(function(balance) {
		return assert.equal(
		    balance.toNumber(),
		    tf.expected.initialSupply,
		    tf.expected.initialSupply.toString() + " was not in account[0]"
		);
	    })
    }
      );

    it("pegoutAddress() should return " + tf.expected.pegoutAddress.toString(), function() {
	return DGLD.deployed()
	    .then(instance => instance.pegoutAddress.call())
	    .then(function(result) {
		return assert.equal(
		    result,
		    tf.expected.pegoutAddress,
		    "value of pegoutAddress() was not "  + tf.expected.pegoutAdddress);
	    }
		 );
    });

    it("totalSupply() should be " + tf.expected.initialSupply + " initially", function() {
	var dgld;

	return DGLD.deployed()
	    .then(instance => dgld = instance)
	    .then( () => dgld.totalSupply.call())
	    .then( function(result) {
		let ts=result.toNumber();
		return assert.equal(ts,
				    tf.expected.initialSupply,
				    "totalSupply() amount incorrect: " + ts.toString());
	    });
    });
});

