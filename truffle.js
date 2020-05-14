const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "main lava build hamster radio knee truck resist round blur burden glow";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
          return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/d5404e2201314a19b3a346fc02ecd7ec")
      },
      network_id: 3
    }
  }
};
