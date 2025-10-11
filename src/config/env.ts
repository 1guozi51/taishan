export type EnvMode = "development" | "production";

export interface AppConfig {
  env: EnvMode;
  apiBase: string;
  contractPool: string;
  contractUSDT: string;
  contractCA: string;
  chainId: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  chainName: string;
  isDev: boolean;
  isProd: boolean;
}

export const CONFIG: AppConfig = {
  env: (import.meta.env.VITE_ENV as EnvMode) || "development",
  apiBase: import.meta.env.VITE_API_BASE as string,
  contractPool: import.meta.env.VITE_CONTRACT_POOL as string,
  contractUSDT: import.meta.env.VITE_CONTRACT_USDT as string,
  contractCA: import.meta.env.VITE_CONTRACT_CA as string,
  chainId: import.meta.env.VITE_CHAIN_ID as string,
  rpcUrl: import.meta.env.VITE_RPC_URL as string,
  blockExplorerUrl: import.meta.env.VITE_BLOCK_EXPLORERURLS as string,
  chainName: import.meta.env.VITE_CHAIN_NAME as string,
  isDev: import.meta.env.VITE_ENV === "development",
  isProd: import.meta.env.VITE_ENV === "production",
};
