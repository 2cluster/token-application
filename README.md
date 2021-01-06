This project deploys a StableCoin ERC20 token named "StableUSD" 

for deployment of contract
# npx hardhat run scripts/deploy.js

the address will be saved so that is is automatically used when running the frontend
to start the frontend
# cd ./frontend
# npm start

this application uses the first 3 accounts from the connected metamask wallet
 - account1 : controller
 - account2 : party1
 - account3 : party2

 controller account is used to deploy the contract, in the constructor of the contract i made it so that the totalSupply is retrieved by the contract deployer.

#     constructor () owned() public {
#        _name = "StableUSD";
#        _symbol = "SUSD";
#        _decimals = 2;
#        _mint(msg.sender, 100000000);
#    }

the controller account is also able to use the transferTo function, but first the other accounts need to grant permission to do so.

i provided a demo named 'video.mkv' that can be found in the demo folder

we can also run our own local network
# npx hardhat node

to deploy to this network we can use 
# npx hardhat run scripts/deploy.js --network hardhat
or you can modify the .env file 

I also made tests for 2 contracts
 - NFT (ERC721)
 - StableUSD (ERC20)
they can be found in ./test

to run the test scripts 
# npx hardhat test --network hardhat
the network flag with value 'hardhat' is provided so that the test run on a local network without latency

i also made a script to checkout our ETH balance 
# npm hardhat accounts