import { createPublicClient, defineChain, http, type Address } from "viem";
import { sepolia as viemSepolia } from "viem/chains";

export const SEPOLIA_CHAIN_ID = 11155111;
export const REDBELLY_CHAIN_ID = 153;

export const LOCK_VAULT_ADDRESS: Address = "0x130d07624d00DF30A5C30C3D237fD5d99A3DdE11";
export const WETH_RB_ADDRESS: Address = "0x11Bef97d2d2063b41887A76403B852b52D151501";

export const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
export const REDBELLY_RPC = "https://governors.testnet.redbelly.network";

export const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";
export const REDBELLY_EXPLORER = "https://redbelly.testnet.routescan.io";

export const sepoliaChain = defineChain({
  ...viemSepolia,
  rpcUrls: { default: { http: [SEPOLIA_RPC] } },
});

export const redbellyTestnet = defineChain({
  id: REDBELLY_CHAIN_ID,
  name: "Redbelly Testnet",
  nativeCurrency: { name: "RBNT", symbol: "RBNT", decimals: 18 },
  rpcUrls: { default: { http: [REDBELLY_RPC] } },
  blockExplorers: { default: { name: "Redbelly Explorer", url: REDBELLY_EXPLORER } },
});

/** Params for wallet_addEthereumChain */
export const walletChainParams = {
  [SEPOLIA_CHAIN_ID]: {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: [SEPOLIA_RPC],
    blockExplorerUrls: [SEPOLIA_EXPLORER],
  },
  [REDBELLY_CHAIN_ID]: {
    chainId: "0x99",
    chainName: "Redbelly Testnet",
    nativeCurrency: { name: "RBNT", symbol: "RBNT", decimals: 18 },
    rpcUrls: [REDBELLY_RPC],
    blockExplorerUrls: [REDBELLY_EXPLORER],
  },
} as const;

export const lockVaultAbi = [
  {
    type: "function",
    name: "lock",
    stateMutability: "payable",
    inputs: [{ name: "redbellyRecipient", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "MIN_LOCK_AMOUNT",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "MAX_LOCK_AMOUNT",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "nonce",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "event",
    name: "Locked",
    inputs: [
      { name: "nonce", type: "uint256", indexed: true },
      { name: "sender", type: "address", indexed: true },
      { name: "redbellyRecipient", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const wethBridgedAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "MAX_SUPPLY",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "computeMintKey",
    stateMutability: "pure",
    inputs: [
      { name: "sourceChainId", type: "uint256" },
      { name: "sourceNonce", type: "uint256" },
    ],
    outputs: [{ type: "bytes32" }],
  },
  {
    type: "function",
    name: "mintRequests",
    stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "approvalCount", type: "uint256" },
      { name: "executed", type: "bool" },
    ],
  },
  {
    type: "event",
    name: "MintApproved",
    inputs: [
      { name: "mintKey", type: "bytes32", indexed: true },
      { name: "signer", type: "address", indexed: true },
      { name: "approvalCount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "MintExecuted",
    inputs: [
      { name: "mintKey", type: "bytes32", indexed: true },
      { name: "recipient", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

export const sepoliaClient = createPublicClient({
  chain: sepoliaChain,
  transport: http(SEPOLIA_RPC),
});

export const redbellyClient = createPublicClient({
  chain: redbellyTestnet,
  transport: http(REDBELLY_RPC),
});

export const sepoliaTxUrl = (hash: string) => `${SEPOLIA_EXPLORER}/tx/${hash}`;
export const redbellyTxUrl = (hash: string) => `${REDBELLY_EXPLORER}/tx/${hash}`;

export const shorten = (value?: string, size = 4) =>
  value ? `${value.slice(0, 2 + size)}…${value.slice(-size)}` : "";

export const isAddressLike = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value.trim());
