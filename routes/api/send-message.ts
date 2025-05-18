import { Handlers } from "$fresh/server.ts";
import { relayer, WORLD_CHAT_ADDRESS } from "../../utils/deps.ts";

export const handler: Handlers = {
  async POST(req) {
    const { calldata } = await req.json();

    const gas_price = 21_000n;
    const nonce = await relayer.getNonce("pending");

    const tx = await relayer.populateTransaction({
      type: 0,
      value: 0,
      data: calldata,
      gasPrice: gas_price,
      nonce,
      gasLimit: gas_price * 10n,
      to: WORLD_CHAT_ADDRESS,
    });

    const txResponse = await relayer.sendTransaction(tx);

    return new Response(JSON.stringify({ hash: txResponse.hash }), {
      status: 200,
    });
  },
};
