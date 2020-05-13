pragma solidity ^0.5.16;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract DGLD is ERC20Detailed, ERC20Mintable {

  //Tokens * decimals
  uint256 constant private _initialSupply = 0;

  //DGLD pegout address
  address constant private _pegoutAddress = 0x00000000000000000000000000000000009ddEAd;

  //name, sumbol, decimals
  constructor() public ERC20Detailed("DGLD", "DGLD", 8)
                       ERC20Mintable(){
     mint(msg.sender, _initialSupply);	
  }


  /**	
     * @dev Returns the initial supply of tokens.
    */
  function initialSupply() public pure returns (uint256)
  {
     return _initialSupply;
  }


  /**	
     * @dev Returns the pegout address.
     * ***WARNING*** any tokens transferred to this address will be destroyed.
     *
     * This address can be used to transfer DGLD tokens from this ethereum contract to the
     * DGLD federated sidechain. Failure to follow the procedure outlined below will result
     * in permanent loss of tokens.
     *
     * For whitelisting instructions see dgld.ch.
     * For support contact XXXXXX
     *
     * PEGOUT INSTRUCTIONS
     * To transfer tokens to an address on the DGLD side chain:
     * 1) Obtain a whitelisted DGLD sidechain address (`receiver` address).;
     * 2) Import the `receiver` address private key into an Ethereum wallet in order to generate the corresponding Ethereum account (`sender` account).
     * 3) Transfer the required number of DGLD tokens to the `sender` account.
     * 4) Obtain the `pegout` address using the pegoutAddress() function.
     * 5) Transfer the required number of tokens from the `sender` account to the `pegout` address.
     *
     *
     * ALTERNATIVE PEGOUT INSTRUCTIONS
     * To transfer tokens to an address on the DGLD side chain:
     * 1) Import the private key from an Ethereum account (`sender` account) into a DGLD sidechain wallet and ensure the corresponding address is whitelisted (see dgld.ch for instructions on whitelisting).
     * 2) Obtain the `pegout` address using the pegoutAddress() function.
     * 3) From the `sender` account, transfer the required number of tokens to the `pegout` address.
     *  
    */
  function pegoutAddress() public pure returns (address) {
      return _pegoutAddress;
  }


     /**
     * @dev Calls super._transfer(sender, recipient, amount). If the recipient is _pegoutAddress, the tokens are then burned.
     *
     * See {super._transfer} and {super._burn} 
     */
 function _transfer(address sender, address recipient, uint256 amount) internal {
      super._transfer(sender, recipient, amount);
      if (recipient == _pegoutAddress) {
        _burn(_pegoutAddress, amount);
      }
  }

}

