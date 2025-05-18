import { ethers } from "npm:ethers";

const abi = new ethers.AbiCoder();

const BYTE = 2;
//const WORD = BYTE * 32;
const WORLD_CHAT_MESSAGE_LENGTH = 381 * BYTE;
const ADDRESS_LENGTH = 20 * BYTE;
const TIMESTAMP_LENGTH = 8 * BYTE;
const CONTENT_LENGTH = 288 * BYTE;
const SIGNATURE_LENGTH = 65 * BYTE;

export type WorldChatMessage = {
  from: string;
  timestamp: string; 
  content: string; 
};

export type WorldChatMessageHex = {
  from: string; //20 bytes
  timestamp: string; //8 bytes
  content: string; //288 bytes
  signature: string; //65 bytes
};

export type WorldChatCallDataHex = {
  method: string;
  history: string;
  location: string;
};

//---------- DECODING ---------//

export function decodeHistory(data: string): WorldChatMessageHex[] {
  const history = data.slice(2);
  if (history.length % WORLD_CHAT_MESSAGE_LENGTH != 0) {
    throw new Error("History: Invalid data");
  }
  const totalMsgs = history.length / WORLD_CHAT_MESSAGE_LENGTH;
  const messages: WorldChatMessageHex[] = [];

  for (let i = 0; i < totalMsgs; i++) {
    const message = decodeMessage(
      history.slice(
        i * WORLD_CHAT_MESSAGE_LENGTH,
        (i + 1) * WORLD_CHAT_MESSAGE_LENGTH,
      ),
    );
    message.content = decodeContent(message.content)
    messages.push(message);
  }
  return messages;
}

function decodeMessage(msg: string): WorldChatMessageHex {
  if (msg.length % WORLD_CHAT_MESSAGE_LENGTH != 0) {
    throw new Error("Message: Invalid data");
  }
  return {
    from: "0x" + msg.slice(0, ADDRESS_LENGTH),
    timestamp: "0x" +
      msg.slice(ADDRESS_LENGTH, ADDRESS_LENGTH + TIMESTAMP_LENGTH),
    content: "0x" +
      msg.slice(
        ADDRESS_LENGTH + TIMESTAMP_LENGTH,
        ADDRESS_LENGTH + TIMESTAMP_LENGTH + CONTENT_LENGTH,
      ),
    signature: "0x" +
      msg.slice(
        ADDRESS_LENGTH + TIMESTAMP_LENGTH + CONTENT_LENGTH,
        ADDRESS_LENGTH + TIMESTAMP_LENGTH + CONTENT_LENGTH + SIGNATURE_LENGTH,
      ),
  } as WorldChatMessageHex;
}

export function decodeWorldChatCalldata(
  calldata: string,
): WorldChatCallDataHex {
  const method = calldata.slice(0, 10);
  const [history, location] = abi.decode(
    ["bytes", "string"],
    "0x" + calldata.slice(10),
  );
  return {
    method,
    history,
    location,
  } as WorldChatCallDataHex;
}

export function decodeContent(content: string): string {
  return ethers.toUtf8String(content).replace(/\x00/g, "").trim();
}

//---------- ENCODING ---------//

export function encodeMessage(
  message: WorldChatMessage,
): string {
  const encodedContent = encodeContent(message.content);
  const packedCore = ethers.solidityPacked(
    ["address", "uint64", "bytes32[9]"],
    [message.from, message.timestamp, encodedContent],
  );
  return packedCore;
}

export function encodeContent(text: string): string[] {
  const bytes = ethers.toUtf8Bytes(text);
  if (bytes.length > 288) throw new Error("Message too long (max 288 bytes)");

  const chunks: string[] = [];
  for (let i = 0; i < 9; i++) {
    const slice = bytes.slice(i * 32, (i + 1) * 32);
    const hex = ethers.hexlify(slice).padEnd(66, "0");
    chunks.push(hex);
  }
  return chunks;
}
