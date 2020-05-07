pragma solidity >=0.4.24<0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract DGLD is ERC20Detailed, ERC20Mintable {

  uint256 _initialSupply;

  //name, sumbol, decimals
  constructor() public ERC20Detailed("DGLD", "DGLD", 8)
                       ERC20Mintable(){

     _initialSupply = 100000 * decimals();
     mint(msg.sender, _initialSupply);	
  }

  function initialSupply() public view returns (uint256)
  {
     return _initialSupply;
  }

}

