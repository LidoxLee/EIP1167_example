import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      //If you want to do some forking, uncomment this
      //  forking: {
      //    url: "MAINNET_RPC_URL"
      //  } ,
      live: false,
      saveDeployments: true,
      tags: ["test", "local"],
      allowUnlimitedContractSize: true,
    },
    localhost: { live: false, saveDeployments: true, tags: ["local"] },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_TOKEN}`,
      accounts: [`${process.env.TEST_DEPLOY_PRIVATE_KEY}`],
      live: true,
      saveDeployments: true,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
