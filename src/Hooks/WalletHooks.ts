import { userAddress, userChainId } from "@/Store/Store";
import { message } from "antd";
import EnvManager from "@/config/EnvManager";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function ensureWalletConnected(): Promise<boolean> {
  const { setAddress } = userAddress.getState();
  const { setChain } = userChainId.getState();
  const { ethereum } = window as any;
  if (!window.ethereum) {
    console.error("未检测到钱包环境");
    return false;
  }

  const currentChainId = await ethereum.request({ method: "eth_chainId" });
  setChain(currentChainId);
  const BNB_PARAMS = {
    chainId: EnvManager.chainId, // 56 的十六进制 => BSC Mainnet
    chainName: EnvManager.chainName,
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [EnvManager.rpcUrl],
    blockExplorerUrls: [EnvManager.blockExplorerUrls],
  };
  let accounts: string[] = [];
  try {
    accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  } catch (err: any) {
    if (err.code == -32002) {
      return false;
    } else {
      return false;
    }
  }

  // 监听是否切换了链
  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });

  if (accounts.length > 0) {
    setAddress(accounts[0]);
    try {
      const normalizedChainId = String(currentChainId).toLowerCase();
      if (normalizedChainId === BNB_PARAMS.chainId) {
        // 已经在BNB链
        return true;
      } else {
        // // 尝试切换到BNB
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BNB_PARAMS.chainId }],
        });
        window.location.reload();
        return true;
      }
    } catch (error: any) {
      // 4902 表示链未添加
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [BNB_PARAMS],
          });
          window.location.reload();
          return true;
        } catch (addError: any) {
          message.error("添加 BNB 网络失败：" + addError.message);
          return false;
        }
      } else {
        message.error("请手动切换至 BNB 主链：" + error.message);
        return false;
      }
    }
  } else {
    return false;
  }
}

export async function WalletSing(
  message: string,
  address: string
): Promise<string> {
  try {
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });
    return signature as string;
  } catch (err) {
    console.warn("签名被拒绝或失败:", err);
    return "";
  }
}
