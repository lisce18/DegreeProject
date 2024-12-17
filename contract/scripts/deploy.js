const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const Escrow = await hre.ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy({ from: deployer.address }); // Correctly pass the deployer address

    const address = await escrow.getAddress();

    console.log("Escrow contract deployed to:", address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
