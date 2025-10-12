import { useCallback } from "react";
import { ethers } from "ethers";
import { message as antdMessage } from "antd";

/**
 * Hook: 用于通过 MetaMask 签名消息并验证
 * @returns signMessage(message: string) => Promise<string | null>
 */
export const UseSignMessage = () => {
  const signMessage = useCallback(async (msg: string): Promise<string | null> => {
    if (!window.ethereum) {
      antdMessage.error("请先安装 MetaMask 钱包");
      return null;
    }

    try {
      // 创建 provider & signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // 请求连接钱包
      const signer = provider.getSigner();

      // 获取钱包地址
      const address = await signer.getAddress();

      // 请求用户签名
      const signature = await signer.signMessage(msg);

      // 验证签名是否与当前钱包一致
      const recovered = ethers.utils.verifyMessage(msg, signature);
      if (recovered.toLowerCase() !== address.toLowerCase()) {
        antdMessage.error("签名验证失败，请重试");
        return null;
      }

      // antdMessage.success("签名成功");
      return signature;
    } catch (error: any) {
      // 用户拒绝签名或其他错误
      if (error.code === 4001) {
        // EIP-1193 用户拒绝请求
        antdMessage.warning("用户取消了签名请求");
      } else {
        console.error("签名错误:", error);
        antdMessage.error("签名失败，请检查钱包或网络");
      }
      return null;
    }
  }, []);

  return { signMessage };
};
