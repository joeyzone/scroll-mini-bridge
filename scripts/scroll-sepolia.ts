import { ethers } from "ethers";
import "dotenv/config";

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

const zysyncWallet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "",
  sepProvider
);

async function main() {
  const scrollPoolAddress = "0xc8ee279faa4f410cb3b290cfd4c14b5d6d5f5bea";

  const sepPoolAddress = "0x389f07fb896a487d042378485c50270d2d793b1e";

  const abi = [
    "function crossChainTransferIn(uint256 chainId,address tokenAddress,uint256 amount)",
    "function crossChainTransferOut(bytes32 originTxHash,uint256 chainId,address tokenAddress,address toWallet,uint256 amount)",
    "event CrossChainTransferIn(uint256 chainId,address indexed from,address indexed to, address indexed tokenAddress, uint256 amount, uint256 fees)",
  ];

  const contractScrollPool = new ethers.Contract(
    scrollPoolAddress,
    abi,
    scrollWalllet
  );

  const contractSeplPool = new ethers.Contract(
    sepPoolAddress,
    abi,
    zysyncWallet
  );

  // eth from scroll to zysync
  contractScrollPool.on(
    "CrossChainTransferIn",
    (chainId, from, to, _tokenAddress, amount, _fees, event) => {
      contractSeplPool.crossChainTransferOut(
        event.transactionHash,
        chainId,
        from,
        to,
        amount
      );
    }
  );

  // eth from zysync to scroll
  contractSeplPool.on(
    "CrossChainTransferIn",

    (chainId, from, to, _tokenAddress, amount, _fees, event) => {
      console.log(
        "🚀 ~ file: scroll-sepolia.ts:62 ~ main ~ CrossChainTransferIn:",
        event.transactionHash,
        chainId,
        from,
        to,
        amount
      );
      contractScrollPool.crossChainTransferOut(
        event.transactionHash,
        chainId,
        from,
        to,
        amount
      );
    }
  );

  setTimeout(() => {
    contractSeplPool.crossChainTransferIn(
      534351,
      "0x0780cbe8293C6578Fd9C8E312d9915441D5bb883",
      ethers.parseEther("0.1")
    );
  }, 10000);
}

main();
