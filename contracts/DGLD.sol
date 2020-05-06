pragma solidity >=0.4.24<0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract DGLD is ERC20Detailed, ERC20Mintable {
  uint8 __decimals = 8;
  string __name = "DGLD";
  string __symbol = "DGLD";
  uint INITIAL_SUPPLY = 100000 * __decimals;

  constructor() public ERC20Detailed(__name, __symbol, __decimals)
                       ERC20Mintable(){
    mint(msg.sender, INITIAL_SUPPLY);	
  }

//  function mint(address account, uint256 amount) public whenNotPaused returns (bool) {
//    return super.mint(account, amount);
//  }
}

