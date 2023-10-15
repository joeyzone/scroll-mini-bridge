import { ethers } from "ethers";
// import { Provider, utils, types, Contract } from "zksync2-js";

const ALCHEMY_SCROLL_URL = "https://sepolia-rpc.scroll.io/";

const scrollProvider = new ethers.JsonRpcProvider(ALCHEMY_SCROLL_URL);
const zysyncProvider = new ethers.WebSocketProvider(
  `wss://testnet.era.zksync.dev/ws`
);

async function main() {
  const scrollPoolAddress = "0x551197e6350936976DfFB66B2c3bb15DDB723250";

  const zysyncPoolAddress = "0x2B7Ef25c3D74F7164F477D387A93d1cDdD144031";

  const abi = [
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];

  const contractScrollPool = new ethers.Contract(
    scrollPoolAddress,
    abi,
    scrollProvider
  );

  const contractzySynclPool = new ethers.Contract(
    zysyncPoolAddress,
    abi,
    zysyncProvider
  );

  // eth from scroll to base

  contractScrollPool.on("Transfer", (from, to, amount) => {
    console.log("contractScrollPool", from, to, amount);

    //   contractzySynclPool.crossChainTransferOut(chainId, from, to, amount);
  });

  contractzySynclPool.on("Transfer", (event) => {
    // optional filter parameters

    console.log(1232313, event);
  });
}

main();
