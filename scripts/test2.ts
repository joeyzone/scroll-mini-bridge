import { ethers } from "ethers";
// import { Provider, utils, types, Contract } from "zksync2-js";

const ALCHEMY_SCROLL_URL = "https://sepolia-rpc.scroll.io/";
const ALCHEMY_BASE_URL = "https://goerli.base.org";

const scrollProvider = new ethers.JsonRpcProvider(ALCHEMY_SCROLL_URL);
const baseProvider = new ethers.JsonRpcProvider(ALCHEMY_BASE_URL);

async function main() {
  const scrollPoolAddress = "0x551197e6350936976DfFB66B2c3bb15DDB723250";

  const basePoolAddress = "0x2B7Ef25c3D74F7164F477D387A93d1cDdD144031";

  const abi = [
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];

  const contractScrollPool = new ethers.Contract(
    scrollPoolAddress,
    abi,
    scrollProvider
  );

  const contractBasePool = new ethers.Contract(
    basePoolAddress,
    abi,
    baseProvider
  );

  // eth from scroll to base

  contractScrollPool.on("Transfer", (from, to, amount) => {
    console.log("scroll: ", from, to, amount);

    //   contractBasePool.crossChainTransferOut(chainId, from, to, amount);
  });

  contractBasePool.on("Transfer", (from, to, amount) => {
    console.log("base: ", from, to, amount);

    //   contractBasePool.crossChainTransferOut(chainId, from, to, amount);
  });
}

main();
