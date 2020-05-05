pragma solidity ^0.6.4;


import './StandardToken.sol';


/**
 * @title GoldToken (DGLD) ERC20 Token
 */
contract GoldToken is StandardToken {

    string public name = "Digital Gold";
    string public symbol = "DGLD";
    uint256 public decimals = 8;

    //uint256 public supplyExponent = 0;
    //uint256 public totalSupply = (10 ** supplyExponent) * (10 ** decimals);

    uint256 public totalSupply = 0;

    constructor(address pegin) {
      balances[pegin] = totalSupply;
    }

}
