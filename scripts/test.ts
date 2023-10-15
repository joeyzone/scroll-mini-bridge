import { ethers } from "ethers";
// import { Provider, utils, types, Contract } from "zksync2-js";

const ALCHEMY_SCROLL_URL = "https://sepolia-rpc.scroll.io/";
const ALCHEMY_BASE_URL = "https://mainnet.base.org/";

const scrollProvider = new ethers.JsonRpcProvider(ALCHEMY_SCROLL_URL);
const baseProvider = new ethers.JsonRpcProvider(ALCHEMY_BASE_URL);

async function main() {
  console.log(`Network: ${JSON.stringify(await baseProvider.getNetwork())}`);
  const scrollPoolAddress = "0x551197e6350936976DfFB66B2c3bb15DDB723250";

  const basePoolAddress = "0xb4c0f77e759e1b9a750b3302aa81dc39263cd136";

  const abi = [
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];

  const abi2 = [
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  ];

  const contractScrollPool = new ethers.Contract(
    scrollPoolAddress,
    abi,
    scrollProvider
  );

  const contractbaselPool = new ethers.Contract(
    basePoolAddress,
    abi2,
    baseProvider
  );

  // eth from scroll to base

  contractScrollPool.on("Transfer", (from, to, amount) => {
    console.log("contractScrollPool", from, to, amount);

    //   contractbaselPool.crossChainTransferOut(chainId, from, to, amount);
  });

  contractbaselPool.on("Approval", (from, to, amount) => {
    console.log("contractbaselPool", from, to, amount);

    //   contractbaselPool.crossChainTransferOut(chainId, from, to, amount);
  });
}

main();
