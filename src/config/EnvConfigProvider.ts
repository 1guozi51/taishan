// src/config/EnvConfigProvider.ts

/** 环境配置接口（已去掉 VITE_ 前缀，字段名更友好） */
export interface EnvConfig {
  poolContract: string;
  apiBase: string;
  contractPool: string;
  contractUsdt: string;
  contractCa: string;
  contractIdoPool: string;
  chainId: string;
  rpcUrl: string;
  blockExplorerUrls: string;
  chainName: string;
}

/** 环境配置提供类：集中维护 dev / prod 原始值 */
export default class EnvConfigProvider {
  /** 开发环境配置（测试网） */
  static getDevConfig(): EnvConfig {
    return {
      apiBase: "http://143.92.39.28:9030/api/",
      poolContract: "0x268e52d5814880E00B60780AE9D8c7f1Ac1b4A8c",
      contractIdoPool: "0x77C596103cc479eaCBe5862B514C18C5CCCd35a8", //购买节点的合约地址
      contractPool: "0x9790Efa5C159AFcFfa7fCfeE26D930EAD90Fb2DE",
      contractUsdt: "0x8873bB4707351279e921637f0700BE5f9cef1b1B",
      contractCa: "0xa364d7e33b688adba98F6351200c064a4E134b44",
      swapRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
      chainId: "0x61",
      rpcUrl: "https://bsc-testnet-rpc.publicnode.com/",
      blockExplorerUrls: "http://143.92.39.28:9030/api",
      chainName: "BNB Smart Chain Mainnet",
    };
  }

  /** 生产环境配置（主网） */
  static getProdConfig(): EnvConfig {
    return {
      swapRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
      poolContract: "0x268e52d5814880E00B60780AE9D8c7f1Ac1b4A8c", //节点接口
      apiBase: "https://api.soulca.com/",
      contractIdoPool: "0x77C596103cc479eaCBe5862B514C18C5CCCd35a8", //购买节点的合约地址
      contractPool: "0x7F652Ef3416fCaf4cA88AB42A950E30bFdC8E797",
      contractUsdt: "0x55d398326f99059fF775485246999027B3197955", //
      contractCa: "0xD9f5eE36A1809B10F5aDF005ef52e54E3b5ff1C6",
      chainId: "0x38",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      blockExplorerUrls: "https://bscscan.com",
      chainName: "BNB Smart Chain Mainnet",
    };
  }
}
