import { ethers } from "ethers";
import "dotenv/config";
import CrossChainBridge from "./CrossChainBridge.json";

const ALCHEMY_SCROLL_URL = "https://sepolia-rpc.scroll.io/";
// const ALCHEMY_ZYSYNC_URL = "https://testnet.era.zksync.dev";

const scrollProvider = new ethers.JsonRpcProvider(ALCHEMY_SCROLL_URL);

const scrollWalllet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "",
  scrollProvider
);

async function main() {
  const scrollPoolAddress = "0xc8ee279faa4f410cb3b290cfd4c14b5d6d5f5bea";

  const contractScrollPool = new ethers.Contract(
    scrollPoolAddress,
    CrossChainBridge.abi,
    scrollWalllet
  );

  await contractScrollPool.crossChainTransferIn(
    534351,
    "0x0780cbe8293C6578Fd9C8E312d9915441D5bb883",
    ethers.parseEther("0.01"),
    { value: ethers.parseEther("0.01") }
  );
  console.log("success");
}

main();
