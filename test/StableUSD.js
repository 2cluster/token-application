const { expect } = require("chai");

describe("StableUSD", function () {

  let Token;
  let Contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {

    Token = await ethers.getContractFactory("StableUSD");
    [owner, addr1, addr2] = await ethers.getSigners();


    Contract = await Token.deploy();
    await Contract.deployed();
  });

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      expect(await Contract.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await Contract.balanceOf(owner.address);
      expect(await Contract.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {

      await Contract.transfer(addr1.address, 50);
      const addr1Balance = await Contract.balanceOf(
        addr1.address
      );
      expect(await addr1Balance).to.equal(50);

      await Contract.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await Contract.balanceOf(
        addr2.address
      );
      expect(await addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await Contract.balanceOf(
        owner.address
      );

      expect(Contract.connect(addr2).transfer(addr1.address, 100000000000)
      ).to.be.revertedWith("Not enough tokens");

      expect(await Contract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await Contract.balanceOf(
        owner.address
      );

      await Contract.transfer(addr1.address, 100);

      await Contract.transfer(addr2.address, 50);

      const finalOwnerBalance = await Contract.balanceOf(
        owner.address
      );

      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await Contract.balanceOf(
        addr1.address
      );

      expect(addr1Balance).to.equal(100);

      const addr2Balance = await Contract.balanceOf(
        addr2.address
      );

      expect(addr2Balance).to.equal(50);
    });
  });
});
