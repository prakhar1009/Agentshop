import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    cronosTestnet: {
      url: process.env.CRONOS_RPC_URL || "https://evm-t3.cronos.org",
      accounts: process.env.BACKEND_PRIVATE_KEY 
        ? [process.env.BACKEND_PRIVATE_KEY] 
        : [],
      chainId: 338,
    },
  },
  etherscan: {
    apiKey: {
      cronosTestnet: process.env.CRONOS_EXPLORER_API_KEY || "",
    },
  },
};

export default config;
