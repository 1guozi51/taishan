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
      contractPool: "0xf3f27128C8596915093439671cF223978AA3abae",
      contractUsdt: "0x55d398326f99059fF775485246999027B3197955",
      contractCa: "0x7e0060dD72eBBc2dbA1A1498905657874c6064d3",
      chainId: "0x38",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      blockExplorerUrls: "https://bscscan.com",
      chainName: "BNB Smart Chain Mainnet",
    };
  }

  /** 生产环境配置（主网） */
  static getProdConfig(): EnvConfig {
    return {
      poolContract: "0x268e52d5814880E00B60780AE9D8c7f1Ac1b4A8c",
      apiBase: "https://api.soulca.com/",
      contractPool: "0xf3f27128C8596915093439671cF223978AA3abae",
      contractIdoPool: "0x77C596103cc479eaCBe5862B514C18C5CCCd35a8", //购买节点的合约地址
      contractUsdt: "0x55d398326f99059fF775485246999027B3197955", //
      contractCa: "0x7e0060dD72eBBc2dbA1A1498905657874c6064d3",
      chainId: "0x38",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      blockExplorerUrls: "https://bscscan.com",
      chainName: "BNB Smart Chain Mainnet",
    };
  }
}
