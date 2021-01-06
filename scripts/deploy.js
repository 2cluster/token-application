const contract = process.env.CONTRACT;

async function main() {

  const accounts = await ethers.getSigners();

  console.log("\nThis application will use the",network.name, "network to deploy the contract ")
  console.log("\tTo change accounts, the network, or the contractname \n\tyou can modify the .env file in the project root")

  console.log(
    "\nAccounts that are used for the application:\n",
    "\n\taddress: ",(await accounts[0].getAddress()) ,"\n\tbalance: ", (ethers.utils.formatEther(await accounts[0].getBalance()).toString()), "eth\n\t",
    "\n\taddress: ",(await accounts[1].getAddress()) ,"\n\tbalance: ", (ethers.utils.formatEther(await accounts[1].getBalance()).toString()), "eth\n\t",
    "\n\taddress: ",(await accounts[2].getAddress()) ,"\n\tbalance: ", (ethers.utils.formatEther(await accounts[2].getBalance()).toString()), "eth\n\t"
  );

  const Factory = await ethers.getContractFactory(contract);
  const sc = await Factory.deploy();
  await sc.deployed();

  console.log("Contract info:\n")
  console.log("\tname:    ", await sc.name())
  console.log("\taddress: ", sc.address);

  saveFrontendFiles(sc, accounts);
}

function saveFrontendFiles(sc, acc) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contract";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  let networkId = ethers.provider.network.chainId

  fs.writeFileSync(
    contractsDir + `/adr.json`,
    '{\n\t"contract": "' + sc.address + '",\n\t"network": "' + network.name + '",\n\t"networkId": "' + networkId + '"\n}'
  );

  const SCArtifact = artifacts.readArtifactSync(contract);

  fs.writeFileSync(
    contractsDir + `/abi.json`,
    JSON.stringify(SCArtifact, null, 2)
  );

  let accounts = {}
  let adr = ""

  adr = acc[0].address
  accounts[adr] = "controller"

  adr = acc[1].address
  accounts[adr] = "party1"

  adr = acc[2].address
  accounts[adr] = "party2"


  console.log("\n\nThe following accounts are used in this application\n")
  console.log({accounts}, "\n\n")

  fs.writeFileSync(
    contractsDir + `/acc.json`,
    JSON.stringify({accounts}, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
