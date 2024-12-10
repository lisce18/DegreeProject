import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const privateKey = vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
        ganache: {
            url: "http://127.0.0.1:7545",
            accounts: [privateKey],
        },
    },
};

export default config;
