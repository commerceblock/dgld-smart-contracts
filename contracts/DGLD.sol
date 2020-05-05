qpragma solidity >=0.4.24<0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

//Token name, token symbol, number of decimal places
contract DGLD is ERC20Detailed("DGLD", "DGLD",2), ERC20 {
//  string public name="DGLD";
//  string public symbol="DGLD";
//  uint8  public decimals=2;
  uint INITIAL_SUPPLY=12000;

  constructor() public {
    _mint(msg.sender, INITIAL_SUPPLY);	
  }
}

