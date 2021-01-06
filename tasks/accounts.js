
const HDWalletProvider = require("@truffle/hdwallet-provider");
const util = require('util')
const mnemonic = process.env.MNEMONIC;
const network = process.env.NETWORK;
const infurakey = process.env.INFURAKEY;


provider = new HDWalletProvider(mnemonic, `https://${network}.infura.io/v3/${infurakey}`, 0, 3);

task("accounts", "Prints the list of accounts", async () => {
    const node = await hre.ethers.getDefaultProvider(network);
    const accounts = await provider.addresses;

    for (let account of accounts) {
      let balance = await hre.ethers.provider.getBalance(account);
      let obj = JSON.parse(util.format("{\"network\": \"%s\",\"address\": \"%s\",\"balance\": \"%s\"}", node.network.name, account, ethers.utils.formatEther(balance)));
      console.log(obj);
    }
  });
