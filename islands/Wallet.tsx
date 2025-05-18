import WalletConnection from "../components/WalletButton.tsx";
import { useState } from "preact/hooks";

export default function Wallet() {
  const [isConnected, setIsConnected] = useState(false);

  const handleWalletConnect = (address: string) => {
    setIsConnected(true);
    console.log("Wallet connected:", address);
  };

  const handleWalletDisconnect = () => {
    setIsConnected(false);
    console.log("Wallet disconnected");
  };
  return (
    <WalletConnection
      onConnect={handleWalletConnect}
      onDisconnect={handleWalletDisconnect}
      isConnected={isConnected}
    />
  );
}
