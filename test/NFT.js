const { expect } = require("chai");

describe("NFT", function () {

  let Token;
  let Contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {

    Token = await ethers.getContractFactory("NFT");
    [owner, addr1, addr2] = await ethers.getSigners();


    Contract = await Token.deploy();
    await Contract.deployed();
  });

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      expect(await Contract.owner()).to.equal(owner.address);
    });

    it("Should still have 0 minted tokens", async function () {
      expect(await Contract.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should be able to mint for self", async function () {

      await Contract.Mint(
        owner.address,
        1
      );

      const ownerBalance = await Contract.balanceOf(
        owner.address
      );
      expect(await ownerBalance).to.equal(1);
    });

    it("Should be able to mint for others", async function () {

      await Contract.Mint(
        addr1.address,
        2
      );

      const addr1Balance = await Contract.balanceOf(
        addr1.address
      );

      await Contract.Mint(
        addr2.address,
        3
      );

      const addr2Balance = await Contract.balanceOf(
        addr2.address
      );
      expect(await addr1Balance).to.equal(1);
      expect(await addr2Balance).to.equal(1);
    });

    it("Should not be able to mint with an existing id", async function () {

      await Contract.Mint(
        addr1.address,
        2
      );

      expect(Contract.Mint(addr1.address, 2)
      ).to.be.revertedWith("ERC721: token already minted");
    });
  });

  describe("Transactions", function () {

    it("Should transfer tokens between accounts", async function () {
      await Contract.Mint(
        owner.address,
        3
      );
      await Contract.Transfers(addr1.address, 3);
      const addr1Balance = await Contract.balanceOf(
        addr1.address
      );
      expect(await addr1Balance).to.equal(1);

      await Contract.connect(addr1).Transfers(addr2.address, 3);
      const addr2Balance = await Contract.balanceOf(
        addr2.address
      );
      expect(await addr2Balance).to.equal(1);
    });

    it("Should fail if token is nonexistant", async function () {

      expect(Contract.Transfers(addr1.address, 10)
      ).to.be.revertedWith("ERC721: owner query for nonexistent token");
    });
  });
});
