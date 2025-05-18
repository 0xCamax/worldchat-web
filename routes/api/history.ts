import { Handlers } from "$fresh/server.ts";
import { BLOCKSCOUT_APIKEY, relayer } from "../../utils/deps.ts";

export const handler: Handlers = {
  async GET(_req) {
    try {
      const [memRes, minedRes] = await Promise.all([
        fetch(
          `https://eth-sepolia.blockscout.com/api?module=account&action=pendingtxlist&address=${relayer.address}&page=1&offset=100&apikey=${BLOCKSCOUT_APIKEY}`
        ),
        fetch(
          `https://eth-sepolia.blockscout.com/api?module=account&action=txlist&address=${relayer.address}&page=1&offset=100&sort=asc&apikey=${BLOCKSCOUT_APIKEY}`
        ),
      ]);

      if (!memRes.ok || !minedRes.ok) {
        throw new Error("Blockscout API error");
      }

      const mem: [] = (await memRes.json()).result;
      const mined: [] = (await minedRes.json()).result;

      const combined = [...mem, ...mined];

      return new Response(JSON.stringify({ items: combined }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("Error fetching mempool:", err);

      // ✅ Siempre devolver JSON aunque sea error
      return new Response(
        JSON.stringify({ error: "Internal Server Error", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
