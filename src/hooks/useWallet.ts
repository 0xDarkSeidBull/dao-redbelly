import { useCallback, useEffect, useState } from "react";
import {
  createWalletClient,
  custom,
  type Address,
  type EIP1193Provider,
  type WalletClient,
} from "viem";
import { REDBELLY_CHAIN_ID, SEPOLIA_CHAIN_ID, walletChainParams } from "@/lib/bridge";

type SupportedChainId = typeof SEPOLIA_CHAIN_ID | typeof REDBELLY_CHAIN_ID;

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

export function getProvider(): EIP1193Provider | undefined {
  if (typeof window === "undefined") return undefined;
  return window.ethereum;
}

export function useWallet() {
  const [address, setAddress] = useState<Address | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [connecting, setConnecting] = useState(false);
  const [hasProvider, setHasProvider] = useState(true);

  useEffect(() => {
    const provider = getProvider();
    setHasProvider(Boolean(provider));
    if (!provider) return;

    const sync = async () => {
      try {
        const accounts = (await provider.request({ method: "eth_accounts" })) as Address[];
        setAddress(accounts?.[0]);
        const id = (await provider.request({ method: "eth_chainId" })) as string;
        setChainId(Number(id));
      } catch {
        /* ignore */
      }
    };
    void sync();

    const onAccounts = (accounts: unknown) => setAddress((accounts as Address[])?.[0]);
    const onChain = (id: unknown) => setChainId(Number(id as string));

    const anyProvider = provider as unknown as {
      on?: (event: string, handler: (arg: unknown) => void) => void;
      removeListener?: (event: string, handler: (arg: unknown) => void) => void;
    };
    anyProvider.on?.("accountsChanged", onAccounts);
    anyProvider.on?.("chainChanged", onChain);
    return () => {
      anyProvider.removeListener?.("accountsChanged", onAccounts);
      anyProvider.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) throw new Error("No EVM wallet detected. Install MetaMask to continue.");
    setConnecting(true);
    try {
      const accounts = (await provider.request({ method: "eth_requestAccounts" })) as Address[];
      setAddress(accounts?.[0]);
      const id = (await provider.request({ method: "eth_chainId" })) as string;
      setChainId(Number(id));
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => setAddress(undefined), []);

  const switchChain = useCallback(async (target: SupportedChainId) => {
    const provider = getProvider();
    if (!provider) throw new Error("No EVM wallet detected.");
    const params = walletChainParams[target];
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: params.chainId }],
      } as never);
    } catch (error) {
      const code = (error as { code?: number })?.code;
      if (code === 4902 || code === -32603) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [params],
        } as never);
      } else {
        throw error;
      }
    }
    const id = (await provider.request({ method: "eth_chainId" })) as string;
    setChainId(Number(id));
  }, []);

  const getWalletClient = useCallback((): WalletClient => {
    const provider = getProvider();
    if (!provider) throw new Error("No EVM wallet detected.");
    return createWalletClient({ transport: custom(provider) });
  }, []);

  return {
    address,
    chainId,
    connecting,
    hasProvider,
    isConnected: Boolean(address),
    connect,
    disconnect,
    switchChain,
    getWalletClient,
  };
}
