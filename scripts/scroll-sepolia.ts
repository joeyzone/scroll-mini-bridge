import { ethers } from "ethers";
import "dotenv/config";
import CrossChainBridge from "./CrossChainBridge.json";

const ALCHEMY_SCROLL_URL = "https://sepolia-rpc.scroll.io/";
// const ALCHEMY_ZYSYNC_URL = "https://testnet.era.zksync.dev";

const scrollProvider = new ethers.JsonRpcProvider(ALCHEMY_SCROLL_URL);
const sepProvider = new ethers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/Fnaj_O1Nd_eWSGJ4ah9_dSduk3-Zx_Kf"
);

const scrollWalllet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "",
  scrollProvider
);

const scrollWallet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "",
  sepProvider
);

async function main() {
  const scrollPoolAddress = "0xc8ee279faa4f410cb3b290cfd4c14b5d6d5f5bea";

  const sepPoolAddress = "0x389f07fb896a487d042378485c50270d2d793b1e";

  const contractScrollPool = new ethers.Contract(
    scrollPoolAddress,
    CrossChainBridge.abi,
    scrollWalllet
  );

  const contractScrollPool2 = new ethers.Contract(
    scrollPoolAddress,
    CrossChainBridge.abi,
    scrollProvider
  );

  const contractSeplPool = new ethers.Contract(
    sepPoolAddress,
    CrossChainBridge.abi,
    scrollWallet
  );

  const contractSepSockets = new ethers.Contract(
    sepPoolAddress,
    CrossChainBridge.abi,
    new ethers.WebSocketProvider(
      "wss://eth-sepolia.g.alchemy.com/v2/Fnaj_O1Nd_eWSGJ4ah9_dSduk3-Zx_Kf"
    )
  );

  // eth from scroll to sepolia

  contractScrollPool2.on(
    "CrossChainTransferIn",
    async (chainId, walletAddress, _tokenAddress, amount, _fees, event) => {
      console.log(
        "scroll in:",
        event.log.transactionHash,
        chainId,
        ethers.ZeroAddress,
        walletAddress,
        amount
      );
      try {
        const tx = await contractSeplPool.crossChainTransferOut(
          event.log.transactionHash,
          chainId,
          ethers.ZeroAddress,
          walletAddress,
          amount
        );
        console.log(`cross transfer success ${tx.hash}`);
      } catch (error) {
        console.log("🚀 ~ file: scroll-sepolia.ts:77 ~ error:", error);
      }
    }
  );

  // eth from sepolia to scroll
  contractSepSockets.on(
    "CrossChainTransferIn",
    async (chainId, walletAddress, _tokenAddress, amount, _fees, event) => {
      console.log(
        "sepolia in:",
        event.log.transactionHash,
        chainId,
        ethers.ZeroAddress,
        walletAddress,
        amount
      );
      try {
        const tx = await contractScrollPool.crossChainTransferOut(
          event.log.transactionHash,
          chainId,
          ethers.ZeroAddress,
          walletAddress,
          amount
        );
        console.log(`cross transfer success ${tx.hash}`);
      } catch (error) {
        console.log("🚀 ~ file: scroll-sepolia.ts:104 ~ error:", error);
      }
    }
  );

  dealTransferIn(contractSeplPool, contractScrollPool);
  dealTransferIn(contractScrollPool, contractSeplPool);
}

async function dealTransferIn(poolIn: any, poolOut: any) {
  const block = await sepProvider.getBlockNumber();
  console.log(
    "🚀 ~ file: scroll-sepolia.ts:90 ~ dealTransferIn ~ block:",
    block
  );

  const transferOutScrollEvents = await poolOut.queryFilter(
    "CrossChainTransferOut",
    block - 500,
    block
  );

  const transferInEvents = await poolIn.queryFilter(
    "CrossChainTransferIn",
    block - 500,
    block
  );
  console.log(
    "🚀 ~ file: scroll-sepolia.ts:100 ~ dealTransferIn ~ transferInEvents:",
    transferInEvents.length
  );

  console.log("CrossChainTransferOut: ", transferOutScrollEvents.length);

  transferInEvents.forEach(async (event: any) => {
    console.log(
      "sepolia transferIn: ",
      event.transactionHash,
      event?.args[1],
      event?.args[2],
      event?.args[3]
    );
    const eventIntxHash = event.transactionHash;
    let alreadyOut = false;
    transferOutScrollEvents.some((eventsOut: any) => {
      if (eventIntxHash === eventsOut.transactionHash) {
        return (alreadyOut = true);
      }
    });
    if (alreadyOut) {
      return;
    }

    //    function crossChainTransferOut(
    //     bytes32 originTxHash,
    //     uint256 originChainId,
    //     address tokenAddress,
    //     address toWallet,
    //     uint256 amount
    // ) external onlyMessenger {
    console.log(
      "args:",
      event.transactionHash,
      event?.args[0],
      ethers.ZeroAddress,
      event?.args[2],
      event?.args[3]
    );
    // await poolOut.crossChainTransferOut(
    //   event.transactionHash,
    //   event?.args[0],
    //   ethers.ZeroAddress,
    //   event?.args[2],
    //   //   event?.args[3]
    //   ethers.parseEther("0.001")
    // );
    // console.log("cross transfer success");
  });
}

main();
