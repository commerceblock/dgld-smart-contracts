# dgld-smart-contracts
Goldtoken DGLD ERC20 Smart Contracts dgld.ch

## Requirements
See 'requirements.sh'

## Docker environment:
### Build:
```
docker build -t dgld-smart-contract .

```
### Test:
```
$ docker run --rm -it -e MNEMONIC=<TEST MNEMONIC> -e INFURA_API_KEY=<INFURA API KEY> dgld-smart-contract bash -c "cd /usr/src/ && truffle develop"
truffle(develop)> test
```

### Run bash in container:
```                                                                                      
$ docker run --rm -it -e MNEMONIC=<MNEMONIC> -e INFURA_API_KEY=<INFURA API KEY> dgld-smart-contract bash -c "cd /usr/src/"
```

## To run the tests
### Using Ganache
Start a test blockchain using Ganache (https://www.trufflesuite.com/ganache), then:
```
$ truffle test
```

### Using the truffle development environment
To run the tests in Truffle development requires node version 11 or earlier due to the following issue: https://github.com/trufflesuite/truffle/issues/2463.

To run the tests, switch to truffle development:

```
$ truffle develop
```

Then run the tests:

```
truffle(develop)> test
```

#### To switch to node version 11 using 'n':
```
$ npm install -g n 
$ sudo n 11
```

## Pegout instructions
To transfer tokens from a wrapped-DGLD address to a DGLD address: see the comments in contracts/wrapped-DGLD.sol for the pegout instructions. 

## Pegin instructions 
To transfer tokens from a nominated DGLD address to the corresponding wrapped-DGLD Ethereum address:

1) Obtain the private key from the address you will send the tokens from e.g. in ocean wallet: 

If the address tab is not visible click View->Show addresses
Open the addresses tab
Right click the address you will send the tokens from and select “Private key”. The private
key is in WIF format and is the string of characters beginning with ‘T’.
Convert the private key from WIF format to HEX format. This step is required in order to
import the key into an Ethereum wallet. There are tools available in the ‘ethbridge’
package (https://github.com/commerceblock/ethbridge) for doing this. In python:

```
>>> from bridge.utils import wif_to_priv_hex
>>> wif_to_priv_hex(‘your_wif_priv_key’)
>>> wif_to_eth_address(‘your_wif_priv_key’)
```

2) Import the private key into an Ethereum wallet:
       In metamask, click on the account icon in the top right. Click in import wallet, enter the
       private key hex and click import. To verify that this has been done correctly, confirm that
       the address matches the one obtained using wif_to_eth_address.Make the wrapped-DGLD token
       visible. In metamask, go to menu->add token -> custom token and enter the ERC20 contract
       address.

3) You can now send tokens from your nominated DGLD address to the Ethereum bridge address and they
will be transferred to the corresponding Ethereum address. 

The bridge address (DGLD -> wrapped_DGLD) is:
GYCkMfvPea7A3uftYaBzYqvHYfv4mcx8M9

## Deploy to testnet

```
$ truffle compile
$ truffle migrate --network <network>
```

where ```<network>``` is either ```development``` (local) or ```ropsten``` (Ethereum POW testnet).
