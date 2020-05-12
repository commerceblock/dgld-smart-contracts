const DGLD = artifacts.require('DGLD');

const expected = {
    name: "DGLD",
    symbol: "DGLD",
    decimals: 8,
    initialSupply: 800000,
    pegAddress: "0x00000000000000000000000000000000009ddEAd"
}

const errors = {
    nonMinter: "Error: Returned error: VM Exception while processing transaction: revert MinterRole: caller does not have the Minter role -- Reason given: MinterRole: caller does not have the Minter role.",
    allowance: "Error: Returned error: VM Exception while processing transaction: revert ERC20: transfer amount exceeds allowance -- Reason given: ERC20: transfer amount exceeds allowance.",
    balance: "Error: Returned error: VM Exception while processing transaction: revert ERC20: transfer amount exceeds balance -- Reason given: ERC20: transfer amount exceeds balance."
}

function requireError(error, expectedError){
    assert(error, "requireError: no error thrown");
    assert.equal(error.toString(), expectedError, "requireError: unexpected error");
}

//Start test block
contract('DGLD constants and initialization test', accounts => {

    it("name should be " + expected.name, function() {
	return DGLD.deployed()
	    .then(instance => instance.name.call())
	    .then( name => assert.equal(name, expected.name, "incorrect name"));
    });

    it("symbol should be " + expected.symbol, function() {
	return DGLD.deployed()
	    .then(instance => instance.symbol.call())
	    .then( symbol => assert.equal(symbol, expected.symbol, "incorrect symbol"));
    });

    it("decimals should be " + expected.decimals, function() {
	return DGLD.deployed()
	    .then(instance => instance.decimals.call())
	    .then( decimals => assert.equal(decimals, expected.decimals, "incorrect decimals"));
    });
        
    it("initialSupply() should return " + expected.initialSupply.toString(), function()
       {
	   return DGLD.deployed()
	       .then(instance => instance.initialSupply.call())
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
		return assert.equal(
		    balance.toNumber(),
		    expected.initialSupply,
		    expected.initialSupply.toString() + " was not in account[0]"
		);
	    })
    }
      );

    it("getPegAddress() should return " + expected.pegAddress.toString(), function() {
	return DGLD.deployed()
	    .then(instance => instance.getPegAddress.call())
	    .then(function(result) {
		return assert.equal(
		    result,
		    expected.pegAddress,
		    "value of getPegAddress() was not "  + expected.pegAdddress);
	    }
		 );
    });

    it("totalSupply() should be " + expected.initialSupply + " initially", function() {
	var dgld;

	return DGLD.deployed()
	    .then(instance => dgld = instance)
	    .then( () => dgld.totalSupply.call())
	    .then( function(result) {
		let ts=result.toNumber();
		return assert.equal(ts,
				    expected.initialSupply,
				    "totalSupply() amount incorrect: " + ts.toString());
	    });
    });
});

contract('DGLD transfer and allowance test', accounts => {
	 	 
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
	//Require the error to be caught
	    .catch((error) => error)
	    .then(error => requireError(error, errors.allowance))
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
     })
	    .then(() =>  dgld.balanceOf.call(accounts[vapproval.from]))
	    .then(result => fromInitial = result.toNumber())
	    .then(() =>  dgld.balanceOf.call(accounts[vapproval.to]))
	    .then(result => toInitial = result.toNumber())
	// Not allowed to spend from someone elses account without approval
	    .then(() => dgld.transferFrom(accounts[vapproval.from], accounts[vapproval.to], vapproval.amount), {from: accounts[vapproval.to]})
	    .catch((error) => error)
	    .then(error => requireError(error, errors.allowance))
	//Approve the allowance
	    .then(() => dgld.approve(accounts[vapproval.to],vapproval.amount, {from: accounts[vapproval.from]}))
	//Check the allowance is correct
	    .then(() => dgld.allowance(accounts[vapproval.from], accounts[vapproval.to]))
	    .then( allowance => assert.equal(allowance.toNumber(), vapproval.amount, "incorrect allowance"))
	// Not allowed to spend more than the approved amount
	    .then(() => dgld.transferFrom(accounts[vapproval.from], accounts[vapproval.to], vapproval.amount + 1), {from: accounts[vapproval.to]})
	    .catch((error) => error)
	    .then(error => requireError(error, errors.allowance))
	// Not allowed to spend more than is in the account
	    .then(() => dgld.transferFrom(accounts[vapproval.from], accounts[vapproval.to], expected.initialSupply + 1), {from: accounts[vapproval.to]})
	    .catch((error) => error)
	    .then(error => requireError(error, errors.balance))
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
});


contract('DGLD token minting tests', accounts => {
    var vtotal = {
	minted: 0
    }

    function totalSupply() {
	return expected.initialSupply + vtotal.minted;
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
	       .then(error => requireError(error, errors.nonMinter))
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
	       .then(error => requireError(error, errors.nonMinter))
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
	assert.notEqual(expected.initialSupply, totalSupply(), "total supply has not changed");

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


