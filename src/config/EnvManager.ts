// src/config/EnvManager.ts
import EnvConfigProvider from "./EnvConfigProvider";
import type  EnvConfig  from "./EnvConfigProvider" ;
/**
 * EnvManager: 环境配置访问类（纯静态版）
 *
 * ✅ 自动判断 dev / prod
 * ✅ 仅从 EnvConfigProvider 读取配置
 * 🚫 不再从 import.meta.env 或 .env 文件读取覆盖
 */
class EnvManager {
  /** 自动判定当前模式 */
  private static readonly mode: "development" | "production" = (() => {
    const meta = (typeof import.meta !== "undefined" ? (import.meta as any).env : undefined) || {};
    const envMode =
      meta.MODE ||
      meta.VITE_MODE ||
      (typeof process !== "undefined" ? process.env?.VITE_MODE || process.env?.NODE_ENV : undefined) ||
      "development";
    return String(envMode).includes("prod") ? "production" : "development";
  })();

  /** 根据模式获取配置 */
  private static readonly config: Readonly<EnvConfig> =
    EnvManager.mode === "development"
      ? EnvConfigProvider.getDevConfig()
      : EnvConfigProvider.getProdConfig();
  // === 公共访问器 ===
  static get modeName(): "development" | "production" {
    return EnvManager.mode;
  }

  static get isDev(): boolean {
    return EnvManager.mode === "development";
  }

  static get isProd(): boolean {
    return EnvManager.mode === "production";
  }

  static get configAll(): Readonly<EnvConfig> {
    return EnvManager.config;
  }

  static get poolContract(): string {
    return EnvManager.config.poolContract;
  }

  static get contractIdoPool(): string {

    return EnvManager.config.contractIdoPool;
  }

  static get apiBase(): string {
    return EnvManager.config.apiBase;
  }

  static get contractPool(): string {
    return EnvManager.config.contractPool;
  }

  static get contractUsdt(): string {
    return EnvManager.config.contractUsdt;
  }

  static get contractCa(): string {
    return EnvManager.config.contractCa;
  }

  static get chainId(): string {
    return EnvManager.config.chainId;
  }

  static get rpcUrl(): string {
    return EnvManager.config.rpcUrl;
  }

  static get blockExplorerUrls(): string {
    return EnvManager.config.blockExplorerUrls;
  }

  static get chainName(): string {
    return EnvManager.config.chainName;
  }

  /** 调试打印（仅开发环境） */
  static print(): void {
    if (EnvManager.isProd) return;
    console.log("🌍 EnvManager.mode:", EnvManager.mode);
    console.log("🌍 EnvManager.config:", EnvManager.config);
    console.table(EnvManager.config);
  }
}

export default EnvManager;
