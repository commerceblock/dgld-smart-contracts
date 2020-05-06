pragma solidity >=0.4.24<0.6.0;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DGLD.sol";

contract TestDGLDNew {

  uint INITIAL_TOKENS = 100000; 
  uint DECIMAL = 8;

  function assertBalance(DGLD tokenContract, address addr, uint expected) private {
    Assert.equal(tokenContract.balanceOf(addr), expected, "Incorrect number of tokens");	
  }

   function testInitialBalance() public {
     DGLD dgld = new DGLD();     

     uint expected = INITIAL_TOKENS * DECIMAL;


     assertBalance(dgld, tx.origin, expected);
  }


//  function testMinting() public {
//      DGLD dgld = DGLD(DeployedAddresses.DGLD());
//  }

}