import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
        hardhat: {
            chainId: 31337, // Use the default Hardhat chain ID
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337, // Use the default Hardhat chain ID
        },
    },
};

export default config;
