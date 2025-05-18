import { useEffect, useState } from "preact/hooks";
import {
  decodeHistory,
  decodeWorldChatCalldata,
  WorldChatMessage,
} from "../utils/codec.ts";
import { ethers } from "npm:ethers";

interface ChatHistoryProps {
  data: string | null;
}

export default function ChatHistory({ data }: ChatHistoryProps) {
  const [decodedMessages, setDecodedMessages] = useState<WorldChatMessage[]>(
    [],
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      try {
        const calldata = decodeWorldChatCalldata(data);
        const history = decodeHistory(calldata.history);

        setDecodedMessages(history);
        setErrorMessage(null);
      } catch (error: any) {
        console.error("Error al decodificar el historial de mensajes:", error);
        setErrorMessage("Error al decodificar el historial.");
        setDecodedMessages([]);
      }
    } else {
      setDecodedMessages([]);
      setErrorMessage(null);
    }
  }, [data]);

  return (
    <div className="bg-gray-900 text-gray-200 p-4 rounded-lg">
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      <div className="flex-1">
        {decodedMessages.length > 0
          ? (
            decodedMessages.map((msg, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-lg p-3 mb-2 sm:p-4 ${
                  msg.from === "tu_usuario" ? "self-end" : "self-start"
                } ${msg.from === "tu_usuario" ? "bg-blue-700/20" : ""}`}
              >
                <div className="flex items-baseline justify-between sm:block">
                  <span className="text-sm font-semibold text-blue-300 mr-2 sm:block sm:mb-1">
                    {msg.from}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(ethers.toNumber(msg.timestamp)).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-200 mt-1">{msg.content}</p>
              </div>
            ))
          )
          : (
            !errorMessage && data && (
              <p className="text-gray-400">
                Decodificando historial de mensajes...
              </p>
            )
          )}
        {!data && !errorMessage && (
          <p className="text-gray-400">
            No hay historial de mensajes para decodificar.
          </p>
        )}
      </div>
    </div>
  );
}
