import { ethers } from "ethers";
import "dotenv/config";
import CrossChainBridge from "./CrossChainBridge.json";

const ALCHEMY_SCROLL_URL = "https://sepolia-rpc.scroll.io/";
// const ALCHEMY_ZYSYNC_URL = "https://testnet.era.zksync.dev";

const sepProvider = new ethers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/Fnaj_O1Nd_eWSGJ4ah9_dSduk3-Zx_Kf"
);

const sepWallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", sepProvider);

async function main() {
  const sepPoolAddress = "0x389f07fb896a487d042378485c50270d2d793b1e";

  const contractSeplPool = new ethers.Contract(
    sepPoolAddress,
    CrossChainBridge.abi,
    sepWallet
  );

  await contractSeplPool.crossChainTransferIn(
    534351,
    "0x0780cbe8293C6578Fd9C8E312d9915441D5bb883",
    ethers.parseEther("0.01"),
    { value: ethers.parseEther("0.01") }
  );
  console.log("success");
}

main();
