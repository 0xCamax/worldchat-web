import { useCallback, useEffect, useState } from "preact/hooks";
import { h } from "preact";
import { Button } from "./Button.tsx"; // Asegúrate de que la ruta a tus componentes de Shadcn sea correcta
import { CheckCircle, Loader2, Wallet } from "lucide-react";
import { cn } from "../utils/common.ts"; // Asegúrate de que la ruta a utils sea correcta

interface WalletConnectionProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
}

const WalletConnection = (props: WalletConnectionProps) => {
  const { onConnect, onDisconnect, isConnected } = props;
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    if (typeof window === "undefined" || !window.ethereum) {
      setError(
        "Billetera de Ethereum no detectada. Instala MetaMask u otra billetera compatible.",
      );
      setIsLoading(false);
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const connectedAddress = accounts[0];
      setAddress(connectedAddress);
      onConnect(connectedAddress);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("walletConnected", "true");
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Conexión a la billetera rechazada por el usuario.");
      } else {
        setError(`Error al conectar con la billetera: ${err.message || err}`);
      }
      setIsLoading(false);
    }
  }, [onConnect, setIsLoading, setError]);

  const handleDisconnect = () => {
    setAddress(null);
    onDisconnect();
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("walletConnected");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const isWalletConnected = typeof localStorage !== "undefined" &&
        localStorage.getItem("walletConnected") === "true";
      if (isWalletConnected) {
        const checkConnection = async () => {
          setIsLoading(true);
          try {
            const accounts = await window.ethereum.request({
              method: "eth_accounts",
            });
            if (accounts.length > 0) {
              const connectedAddress = accounts[0];
              setAddress(connectedAddress);
              onConnect(connectedAddress);
            }
          } catch (err) {
            console.error("Error checking connection:", err);
            setError("Error al verificar la conexión de la billetera.");
          } finally {
            setIsLoading(false);
          }
        };
        checkConnection();
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          onConnect(accounts[0]);
        } else {
          setAddress(null);
          onDisconnect();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
      };
    }
  }, [onConnect, onDisconnect]);

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Conectando...
        </>
      );
    } else if (isConnected && address) {
      const displayAddress = `${address.substring(0, 6)}...${
        address.substring(
          address.length - 4,
        )
      }`;
      return (
        <>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          {displayAddress}
        </>
      );
    } else {
      return (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Conectar Billetera
        </>
      );
    }
  };

  return (
<div className="flex items-center justify-end">
  <Button
    onClick={isConnected ? handleDisconnect : handleConnect}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-md font-semibold",
      isConnected
        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border border-red-500/30"
        : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 border border-blue-500/30",
      "transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
      "focus:ring-opacity-50",
      isLoading && "opacity-70 cursor-not-allowed", // Estilos para el estado de carga
    )}
    disabled={isLoading}
  >
    {isConnected ? "Desconectar" : "Conectar"}
  </Button>
  {error && (
    <p className="mt-2 text-red-400 text-sm ml-4">
      {error}
    </p>
  )}
</div>
  );
};

export default WalletConnection;
