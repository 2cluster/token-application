require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

const mnemonic = process.env.MNEMONIC;
const network = process.env.NETWORK;
const infurakey = process.env.INFURAKEY;

require("./tasks/accounts");

module.exports = {
  defaultNetwork: network,
  networks: {
    hardhat: {
      accounts: {"mnemonic": mnemonic},
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts: {"mnemonic": mnemonic},
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infurakey}`,
      accounts: {"mnemonic": mnemonic},
      gasMultiplier: 2
    }
  },
  solidity: {
    version: "0.7.5",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    tasks: "./tasks",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 200000
  }
}

