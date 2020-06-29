# dgld-smart-contracts
Goldtoken DGLD ERC20 Smart Contracts dgld.ch

## Requirements
See 'requirements.sh'

## To run in a docker environment:

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
See the comments in contracts/wrapped-DGLD.sol for the pegout instructions.


## Deploy to testnet

```
$ truffle compile
$ truffle migrate --network <network>
```

where ```<network>``` is either ```development``` (local) or ```ropsten``` (Ethereum POW testnet).
