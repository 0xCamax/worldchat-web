// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_history from "./routes/api/history.ts";
import * as $api_send_message from "./routes/api/send-message.ts";
import * as $api_transaction from "./routes/api/transaction.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $ChatHistory from "./islands/ChatHistory.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $Wallet from "./islands/Wallet.tsx";
import * as $WorldChatClient from "./islands/WorldChatClient.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/history.ts": $api_history,
    "./routes/api/send-message.ts": $api_send_message,
    "./routes/api/transaction.ts": $api_transaction,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/ChatHistory.tsx": $ChatHistory,
    "./islands/Counter.tsx": $Counter,
    "./islands/Wallet.tsx": $Wallet,
    "./islands/WorldChatClient.tsx": $WorldChatClient,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
