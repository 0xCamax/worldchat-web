import { ethers } from "npm:ethers";
import { decodeWorldChatCalldata } from "./codec.ts";

export async function sendMessage(
  calldata: string,
  lastData: any,
): Promise<string> {
  if (lastData) {
    const data = decodeWorldChatCalldata(lastData);
    calldata = data.history.concat(calldata.slice(2));
  }

  const method = "0x7c98ed42";

  const abi = new ethers.AbiCoder();

  calldata = abi.encode(["bytes", "string"], [
    calldata,
    globalThis.location.host,
  ]);

  const res = await fetch(`${globalThis.location.origin}/api/send-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ calldata: method.concat(calldata.slice(2)) }),
  });

  return (await res.json()).hash;
}
