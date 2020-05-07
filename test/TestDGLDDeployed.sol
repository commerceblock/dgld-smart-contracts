pragma solidity >=0.4.24<0.6.0;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DGLD.sol";

contract TestDGLDDeployed {

  uint INITIAL_TOKENS = 100000; 
  uint DECIMAL = 8;
  //A random initial nonce

//  function getNewRandomishAddress() public
//    returns (address addr) {
//    addr = address(uint160(uint(keccak256(abi.encodePacked(now)))));
//  }


  function assertBalance(DGLD tokenContract, address addr, uint expected) private {
    Assert.equal(tokenContract.balanceOf(addr), expected, "Incorrect number of tokens");	
  }

  function testInitialBalance() public {
    DGLD dgld = DGLD(DeployedAddresses.DGLD());

    uint expected = INITIAL_TOKENS * DECIMAL;

    assertBalance(dgld, tx.origin, expected);
  }

//  function testMinting() public {
//      DGLD dgld = DGLD(DeployedAddresses.DGLD());

//      address addr1 = getNewRandomishAddress();

//      //Check balance of addr1 initialy zero
//      assertBalance(dgld, addr1, 0);

//      uint nToMint=1000;      

//      //Check that minting fails for non-minter
//      dgld.mint(addr1, nToMint);



//      //New balance
//      assertBalance(dgld, addr1, nToMint);
//  }

}