import { ALCHEMY_API_URL } from "../../utils/deps.ts";
import { Handlers } from "$fresh/server.ts";


export const handler: Handlers = {
  async POST(_req) {
    const { hash } = await _req.json();
    const tx = await fetch(ALCHEMY_API_URL ?? "", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getTransactionByHash",
        params: [hash],
        id: 1,
      }),
    });

    const json = await tx.json();
    return new Response(JSON.stringify(json), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
