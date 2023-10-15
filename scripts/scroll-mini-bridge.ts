import { ethers } from "ethers";
import "dotenv/config";

const ALCHEMY_SCROLL_URL = "https://sepolia-rpc.scroll.io/";
// const ALCHEMY_ZYSYNC_URL = "https://testnet.era.zksync.dev";

const scrollProvider = new ethers.JsonRpcProvider(ALCHEMY_SCROLL_URL);
const zysyncProvider = new ethers.WebSocketProvider(
  `wss://testnet.era.zksync.dev/ws`
);

const scrollWalllet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "",
  scrollProvider
);

const zysyncWallet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "",
  zysyncProvider
);

async function main() {
  const scrollPoolAddress = "0xc8ee279faa4f410cb3b290cfd4c14b5d6d5f5bea";

  const zysyncPoolAddress = "0xc8ee279faa4f410cb3b290cfd4c14b5d6d5f5bea";

  const abi = [
    "function crossChainTransferOut(uint256 chainId,address tokenAddress,address toWallet,uint256 amount)",
    "event CrossChainTransferIn(uint256 chainId,address indexed from,address indexed to, address indexed tokenAddress, uint256 amount, uint256 fees)",
  ];

  const contractScrollPool = new ethers.Contract(
    scrollPoolAddress,
    abi,
    scrollWalllet
  );

  const contractZysynclPool = new ethers.Contract(
    zysyncPoolAddress,
    abi,
    zysyncWallet
  );

  // eth from scroll to zysync
  contractScrollPool.on(
    "CrossChainTransferIn",
    (chainId, from, to, _tokenAddress, amount, _fees) => {
      console.log(chainId, from, to, _tokenAddress, amount, _fees);
      //   contractZysynclPool.crossChainTransferOut(chainId, from, to, amount);
    }
  );

  // eth from zysync to scroll
  contractZysynclPool.on(
    "CrossChainTransferIn",
    (chainId, from, to, _tokenAddress, amount, _fees) => {
      contractScrollPool.crossChainTransferOut(chainId, from, to, amount);
    }
  );
}

main();
