const DGLD = artifacts.require('DGLD');

exports.expected = {
    name: "DGLD",
    symbol: "DGLD",
    decimals: 8,
    initialSupply: 0,
    pegoutAddress: "0x00000000000000000000000000000000009ddEAd"
}

exports.errors = {
    nonMinter: "Error: Returned error: VM Exception while processing transaction: revert MinterRole: caller does not have the Minter role -- Reason given: MinterRole: caller does not have the Minter role.",
    allowance: "Error: Returned error: VM Exception while processing transaction: revert ERC20: transfer amount exceeds allowance -- Reason given: ERC20: transfer amount exceeds allowance.",
    balance: "Error: Returned error: VM Exception while processing transaction: revert ERC20: transfer amount exceeds balance -- Reason given: ERC20: transfer amount exceeds balance.",
    pegindupe: "Error: Returned error: VM Exception while processing transaction: revert a pegin with the given id has already been done -- Reason given: a pegin with the given id has already been done."
}

exports.requireError = function(error, expectedError){
    assert(error, "requireError: no error thrown");
    assert.equal(error.toString(), expectedError, "requireError: unexpected error");
}

exports.assertEventOfType = function(response, eventName, index) {
    assert.equal(response.logs[index].event, eventName, eventName + ' event should fire at index ' +  index);
}

//eventNamesArray is an array of event names in the required order
exports.assertEventsOfType = function (response, eventNamesArray) {
    function assertEvent(value, index){
	exports.assertEventOfType(response, value, index);
    }
    eventNamesArray.forEach(assertEvent);
}




