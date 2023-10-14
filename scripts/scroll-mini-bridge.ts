import { ethers } from "ethers";

const ALCHEMY_SCROLL_URL = "https://SCROLL";
const ALCHEMY_ZYSYNC_URL = "https://ZYSYNC";

const scrollProvider = new ethers.JsonRpcProvider(ALCHEMY_SCROLL_URL);
const zysyncProvider = new ethers.JsonRpcProvider(ALCHEMY_ZYSYNC_URL);

const scrollPoolAddress = "0xaaaaaaa";

const zysyncPoolAddress = "0xbbbbbbbb";

const abi = [
  "function crossChainTransfer (uint256 amount)",
  "function transfer (uint256 amount)",
  "event CrossTransfer(uint amount)",
];

const contractScrollPool = new ethers.Contract(
  scrollPoolAddress,
  abi,
  scrollProvider
);

const contractZysynclPool = new ethers.Contract(
  zysyncPoolAddress,
  abi,
  zysyncProvider
);

contractScrollPool.on("CrossTransfer", (amount) => {
  contractZysynclPool.transfer(amount);
});

contractZysynclPool.on("CrossTransfer", (amount) => {
  contractScrollPool.transfer(amount);
});
