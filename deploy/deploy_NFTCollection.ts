import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre; // we get the deployments and getNamedAccounts which are provided by hardhat-deploy.

  const { deploy } = deployments; // The deployments field itself contains the deploy function.
  const { deployer } = await getNamedAccounts(); // Fetch the accounts. These can be configured in hardhat.config.ts as explained above.

  console.log("deployer address", deployer);

  const NFTCollection = await deploy("NFTCollection", {
    from: deployer,
    args: [true],
    log: true,
  });

  console.log(" NFTCollection deploy to : ", NFTCollection.address);

  const ERC721_Factory = await deploy("ERC721_Factory", {
    from: deployer,
    args: [NFTCollection.address],
    log: true,
  });

  console.log("ERC721_Factory deployed to:", ERC721_Factory.address);
};

export default func;
func.id = "Deploy_NFTCollection_goerli"; // id required to prevent reexecution
func.tags = ["deploy_goerli"];
