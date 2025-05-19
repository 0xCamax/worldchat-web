import { useEffect, useState, useRef } from "preact/hooks";
import { BrowserProvider } from "npm:ethers";
import { sendMessage } from "../utils/sendMessage.ts";
import { encodeMessage, type WorldChatMessage } from "../utils/codec.ts";
import ChatHistory from "./ChatHistory.tsx";
import { getHistory, getTransaction } from "../utils/ethcalls.ts";
import { withSignature } from "../utils/sign.ts";
import Wallet from "../islands/Wallet.tsx";

export default function WorldChatClient() {
  const [content, setContent] = useState("");
  const [history, setHistory] = useState<string | null>(null);
  const [lastHash, setLastHash] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: number | undefined;

    const fetchData = () => {
      if (lastHash) {
        getTransaction(lastHash).then((response) => {
          setHistory(response.result.input);
          setLastTx(response.result);
        });
      } else {
        setIsLoading(true);
        getHistory().then((response) => {
          const sorted = response.items
            .filter((item) => item.input.slice(0, 10) == "0x7c98ed42")
            .sort((a, b) => b.input.length - a.input.length);
          const mostRecent = sorted[0];
          setHistory(mostRecent.input);
          setIsLoading(false);
        });
      }
    };

    fetchData();
    intervalId = globalThis.setInterval(fetchData, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [lastHash]);

  const signAndPack = async () => {
    if (!window.ethereum) {
      alert("No wallet detected");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const timestamp = Date.now();

    const message: WorldChatMessage = {
      from: address,
      timestamp: "0x" + timestamp.toString(16),
      content,
    };

    const encodedMessage = encodeMessage(message);

    const result = await withSignature(signer, encodedMessage);

    const lastHash = await sendMessage(result, lastTx ? lastTx.input : history);

    setLastHash(lastHash);
    setContent("")
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-gray-200 shadow-sm rounded-xl h-64">
      <header className="bg-gray-800 shadow py-4 px-6 sm:py-5 sm:px-8 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-100 sm:text-2xl">
          World Chat
        </h1>
        <Wallet />
      </header>
      <main
        className="flex-1 flex  p-4 space-y-3 sm:space-y-4 overflow-y-scroll flex-col-reverse"
        id="chat-container"
      >
        <ChatHistory data={history} />
        {isLoading ?? <span>Loading...</span>}
      </main>
      <footer className="bg-gray-800 py-4 px-4 border-t border-gray-700 sm:py-5 sm:px-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            className="flex-1 border rounded-md py-2 px-3 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:py-2.5 sm:px-4"
            maxLength={288}
            value={content}
            onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
          />
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md ml-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:py-2.5 sm:px-4"
            onClick={signAndPack}
            type="button"
          >
            Enviar
          </button>
        </div>
      </footer>
    </div>
  );
}
