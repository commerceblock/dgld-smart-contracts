const HDWalletProvider = require("@truffle/hdwallet-provider");

require('dotenv').config()

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
      ,
    ropsten: {
	provider: new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
	network_id: 3,
	gas: 3000000,
	gasPrice: 10000000000
    }
  }
};


