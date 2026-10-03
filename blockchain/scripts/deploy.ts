import { network } from "hardhat";
import fs from "node:fs";

const { ethers } = await network.connect();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying from:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

  const BlueCarbonRegistry = await ethers.getContractFactory(
    "BlueCarbonRegistry"
  );

  const registry = await BlueCarbonRegistry.deploy(deployer.address);

  await registry.waitForDeployment();

  const address = await registry.getAddress();

  console.log("BlueCarbonRegistry deployed to:", address);

  const deployment = {
    network: "sepolia",
    contract: "BlueCarbonRegistry",
    address,
    admin: deployer.address,
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deployment, null, 2)
  );

  console.log("Deployment details saved to deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});