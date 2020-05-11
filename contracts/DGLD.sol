pragma solidity >=0.4.24<0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract DGLD is ERC20Detailed, ERC20Mintable {

  //Tokens * decimals
  uint256 constant private _initialSupply = 100000 * 8;

  //DGLD pegout address
  address constant private _pegAddress = 0x00000000000000000000000000000000009ddEAd;

  //name, sumbol, decimals
  constructor() public ERC20Detailed("DGLD", "DGLD", 8)
                       ERC20Mintable(){
     mint(msg.sender, _initialSupply);	
  }

  function initialSupply() public view returns (uint256)
  {
     return _initialSupply;
  }

  function getPegAddress() public view returns (address) {
      return _pegAddress;
  }

}

