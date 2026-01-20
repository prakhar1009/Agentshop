import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying AgentShop contracts to Cronos Testnet...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "CRO\n");

  // USDC token address on Cronos Testnet (USDC.e - Bridged USDC)
  const USDC_ADDRESS = "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0";
  const PLATFORM_WALLET = deployer.address; // Platform fee recipient

  // Deploy ProductRegistry
  console.log("📦 Deploying ProductRegistry...");
  const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
  const productRegistry = await ProductRegistry.deploy();
  await productRegistry.waitForDeployment();
  const productRegistryAddress = await productRegistry.getAddress();
  console.log("✅ ProductRegistry deployed to:", productRegistryAddress);

  // Deploy EscrowVault
  console.log("\n💰 Deploying EscrowVault...");
  const EscrowVault = await ethers.getContractFactory("EscrowVault");
  const escrowVault = await EscrowVault.deploy(USDC_ADDRESS, PLATFORM_WALLET);
  await escrowVault.waitForDeployment();
  const escrowVaultAddress = await escrowVault.getAddress();
  console.log("✅ EscrowVault deployed to:", escrowVaultAddress);

  // Deploy ReceiptRegistry
  console.log("\n🧾 Deploying ReceiptRegistry...");
  const ReceiptRegistry = await ethers.getContractFactory("ReceiptRegistry");
  const receiptRegistry = await ReceiptRegistry.deploy();
  await receiptRegistry.waitForDeployment();
  const receiptRegistryAddress = await receiptRegistry.getAddress();
  console.log("✅ ReceiptRegistry deployed to:", receiptRegistryAddress);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(60));
  console.log("\n📋 Copy these addresses to your backend .env file:\n");
  console.log(`PRODUCT_REGISTRY_ADDRESS=${productRegistryAddress}`);
  console.log(`ESCROW_VAULT_ADDRESS=${escrowVaultAddress}`);
  console.log(`RECEIPT_REGISTRY_ADDRESS=${receiptRegistryAddress}`);
  console.log("\n" + "=".repeat(60));

  // Verification instructions
  console.log("\n📝 To verify contracts on explorer, run:");
  console.log(`npx hardhat verify --network cronosTestnet ${productRegistryAddress}`);
  console.log(`npx hardhat verify --network cronosTestnet ${escrowVaultAddress} "${USDC_ADDRESS}" "${PLATFORM_WALLET}"`);
  console.log(`npx hardhat verify --network cronosTestnet ${receiptRegistryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
