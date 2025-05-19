import { ethers } from "npm:ethers";

export const WORLD_CHAT_ABI = [
  "function worldChat(bytes calldata history, string calldata location) external",
  "event NewChat(address,bytes)",
];

const isMainnet = false;

export const ALCHEMY_API_URL = isMainnet
  ? Deno.env.get("ALCHEMY_API_MAINNET")
  : Deno.env.get("ALCHEMY_API_SEPOLIA");
export const BLOCKSCOUT_APIKEY = Deno.env.get("BLOCKSCOUT_APIKEY");
export const WORLD_CHAT_ADDRESS = isMainnet
  ? Deno.env.get("WORLD_CHAT_ADDRESS_MAINNET")
  : Deno.env.get("WORLD_CHAT_ADDRESS_SEPOLIA");

export const provider = new ethers.JsonRpcProvider(
  `https://eth-sepolia.blockscout.com/api/eth-rpc?apikey=${BLOCKSCOUT_APIKEY}`,
);
export const relayer = new ethers.Wallet(
  Deno.env.get("WC_RELAYER_KEY") ??
    ethers.keccak256(ethers.toUtf8Bytes("vitalik")),
  provider,
);

if (!ALCHEMY_API_URL) console.log("Undefined Alchemy API URL");
if (!BLOCKSCOUT_APIKEY) console.log("Undefined Blockscout API Key");
if (!WORLD_CHAT_ADDRESS) console.log("Undefined World Chat Address");
if (!Deno.env.get("WC_RELAYER_KEY")) console.log("Undefined WC Relayer Key");
