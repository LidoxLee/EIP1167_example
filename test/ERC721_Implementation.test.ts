import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFTCollection", function () {
  async function deployNFTCollection() {
    // Contracts are deployed using the first signer/account by default
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const account_1 = signers[1];
    const account_2 = signers[2];
    const account_3 = signers[3];
    //get factory
    const NFTCollection_Factory = await ethers.getContractFactory("NFTCollection");
    const NFTCollection_Instance = await NFTCollection_Factory.deploy(false);

    return { deployer, account_1, account_2, account_3, NFTCollection_Instance };
  }

  describe("Deployment", function () {
    it("Should deployer can initialize NFTCollection.", async function () {
      const contract_name = "Test NFT";
      const symbol = "TNFT";
      const salePrice = ethers.utils.parseEther("0.1");
      const maxSupply = 1000;
      const { deployer, NFTCollection_Instance } = await loadFixture(deployNFTCollection);
      await NFTCollection_Instance.initialize(contract_name, symbol, salePrice, maxSupply);
      expect(await NFTCollection_Instance.name()).to.equal(contract_name);
      expect(await NFTCollection_Instance.symbol()).to.equal(symbol);
      expect(await NFTCollection_Instance.salePrice()).to.equal(salePrice);
      expect(await NFTCollection_Instance.maxSupply()).to.equal(maxSupply);
    });

    it("Should not deployer can initialize NFTCollection.", async function () {
      const contract_name = "Test NFT";
      const symbol = "TNFT";
      const salePrice = ethers.utils.parseEther("0.1");
      const maxSupply = 1000;
      const { deployer, NFTCollection_Instance } = await loadFixture(deployNFTCollection);
      // first initialize
      await NFTCollection_Instance.initialize(contract_name, symbol, salePrice, maxSupply);
      // second initialize should be failed
      await expect(NFTCollection_Instance.initialize(contract_name, symbol, salePrice, maxSupply)).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });
  });

  describe("Mint", function () {
    it("Should faild mint token reverted with 'Not correct value'.", async function () {
      const { deployer, NFTCollection_Instance } = await loadFixture(deployNFTCollection);
      const contract_name = "Test NFT";
      const symbol = "TNFT";
      const salePrice = ethers.utils.parseEther("0.1");
      const maxSupply = 1000;
      // initialize
      await NFTCollection_Instance.initialize(contract_name, symbol, salePrice, maxSupply);
      // mint token
      await expect(NFTCollection_Instance.mintNFT(deployer.address)).revertedWith("Not correct value");
    });

    it("Should faild mint token reverted with 'Over maxSupply'.", async function () {
      const { deployer, NFTCollection_Instance } = await loadFixture(deployNFTCollection);
      const contract_name = "Test NFT";
      const symbol = "TNFT";
      const salePrice = ethers.utils.parseEther("0.1");
      const maxSupply = 1; // setup max supply is 1
      // initialize
      await NFTCollection_Instance.initialize(contract_name, symbol, salePrice, maxSupply);

      // mint 1 token with salePrice
      await NFTCollection_Instance.mintNFT(deployer.address, { value: salePrice });

      // mint 2nd token with salePrice should be failed
      await expect(NFTCollection_Instance.mintNFT(deployer.address, { value: salePrice })).revertedWith("Over maxSupply");
    });

    it("Should mint token success and check balance correct.", async function () {
      const { account_1, NFTCollection_Instance } = await loadFixture(deployNFTCollection);
      const contract_name = "Test NFT";
      const symbol = "TNFT";
      const salePrice = ethers.utils.parseEther("0.1");
      const maxSupply = 1000;
      // initialize
      await NFTCollection_Instance.initialize(contract_name, symbol, salePrice, maxSupply);

      // mint 1 token with salePrice
      await NFTCollection_Instance.connect(account_1).mintNFT(account_1.address, { value: salePrice });

      // check balance
      expect(await NFTCollection_Instance.connect(account_1).balanceOf(account_1.address)).to.equal(1);
    });
  });
});
