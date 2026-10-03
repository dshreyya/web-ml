import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress =
    "0xd1CFF091a4B4627250148346Ce9131552b02497a";

  const registry = await ethers.getContractAt(
    "BlueCarbonRegistry",
    contractAddress
  );

  console.log(
    "Contract address:",
    await registry.getAddress()
  );

  const code = await ethers.provider.getCode(
    contractAddress
  );

  console.log(
    "Contract deployed:",
    code !== "0x"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});