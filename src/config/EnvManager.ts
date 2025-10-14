// src/config/EnvManager.ts
import EnvConfigProvider from "./EnvConfigProvider";
import type  EnvConfig  from "./EnvConfigProvider" ;
 /**
 * EnvManager: 公共类，直接通过静态属性访问当前环境的配置
 *
 * 特点：
 * - 自动根据 import.meta.env.MODE 切换 dev/prod
 * - 如果 import.meta.env 中存在对应的 VITE_* 变量，会覆盖默认值（方便 .env 文件）
 * - 可直接使用 EnvManager.apiBase / EnvManager.rpcUrl / EnvManager.isProd / EnvManager.mode 等
 */
class EnvManager {
  // 自动判定 mode（优先使用 import.meta.env，再降级）
  private static readonly mode: "development" | "production" = (() => {
    // 在 Vite 前端环境中使用 import.meta.env
    const meta = (typeof import.meta !== "undefined" ? (import.meta as any).env : undefined) || {};
    const envMode =
      meta.MODE || meta.VITE_MODE || (typeof process !== "undefined" ? process.env?.VITE_MODE || process.env?.NODE_ENV : undefined) || "development";
    return String(envMode).includes("prod") ? "production" : "development";
  })();

  // 从 provider 获取基础配置
  private static baseConfig: EnvConfig =
    EnvManager.mode === "development" ? EnvConfigProvider.getDevConfig() : EnvConfigProvider.getProdConfig();

  // 将 runtime 的 import.meta.env (若存在) 映射为更友好的字段，用以覆盖 baseConfig
  private static applyRuntimeOverrides(cfg: EnvConfig): EnvConfig {
    // 读取 import.meta.env；在非 Vite 环境会是 undefined
    const metaEnv = (typeof import.meta !== "undefined" ? (import.meta as any).env : undefined) || {};
    // 映射表：metaEnv key -> cfg key
    const map: Record<string, keyof EnvConfig> = {
      VITE_API_BASE: "apiBase",
      VITE_CONTRACT_POOL: "contractPool",
      VITE_CONTRACT_USDT: "contractUsdt",
      VITE_CONTRACT_CA: "contractCa",
      VITE_CHAIN_ID: "chainId",
      VITE_RPC_URL: "rpcUrl",
      VITE_BLOCK_EXPLORERURLS: "blockExplorerUrls",
      VITE_CHAIN_NAME: "chainName",
      // 如果用户把 poolContract 也放到 env（不常见），可以映射:
      POOL_CONTRACT: "poolContract",
      VITE_POOL_CONTRACT: "poolContract",
    };

    const out: any = { ...cfg };
    for (const [envKey, cfgKey] of Object.entries(map)) {
      const val = metaEnv[envKey];
      if (typeof val === "string" && val.length > 0) {
        out[cfgKey] = val;
      }
    }
    return out as EnvConfig;
  }

  // 最终配置（合并并冻结）
  private static readonly config: Readonly<EnvConfig> = Object.freeze(
    EnvManager.applyRuntimeOverrides(EnvManager.baseConfig)
  );

  // --- 公开静态访问器（按需扩展） ---
  static get modeName(): "development" | "production" {
    return EnvManager.mode;
  }

  static get isDev(): boolean {
    return EnvManager.mode === "development";
  }

  static get isProd(): boolean {
    return EnvManager.mode === "production";
  }

  static get poolContract(): string {
    return EnvManager.config.poolContract;
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

  /** 返回完整配置副本（只读） */
  static getAll(): EnvConfig {
    return EnvManager.config;
  }

  /** 调试打印（仅在开发控制台有用） */
  static print(): void {
    // 避免在生产中打印
    if (EnvManager.isProd) return;
    // eslint-disable-next-line no-console
    console.log("EnvManager.mode:", EnvManager.mode);
    // eslint-disable-next-line no-console
    console.table(EnvManager.config);
  }
}

export default EnvManager;