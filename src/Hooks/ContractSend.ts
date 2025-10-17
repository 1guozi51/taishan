import ContractList from "../Contract/Contract.ts";
import { type BigNumber, ethers } from "ethers";
import { message } from "antd";

export interface ContractParams {
  tokenName: string;
  methodsName: string;
  params: any[];
  value?: BigNumber;
}

interface ContractObje {
  address: string;
  abi: Array<any>;
}

interface ContractResult {
  value: any;
}

async function useContractSend({
  tokenName,
  methodsName,
  params,
  value,
}: ContractParams): Promise<ContractResult> {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractInfo: ContractObje = ContractList[tokenName];
  const contract = new ethers.Contract(
    contractInfo.address,
    contractInfo.abi,
    signer
  );
  try {
    const gasPrice = await provider.getGasPrice();
    const estimatedGas = await contract.estimateGas[methodsName](...params, {
      value,
    });
    const gasLimit = estimatedGas.mul(130).div(100);
    const tx = await contract[methodsName](...params, {
      value,
      gasPrice,
      gasLimit,
    });
    const receipt = await tx.wait();
    return { value: receipt };
  } catch (err: any) {
    if (
      err.code === "ACTION_REJECTED" ||
      err.message.includes("user rejected")
    ) {
      message.warning("User cancels transaction"); // 你已取消交易签名
    } else {
      let errorMsg = err?.message || String(err);
      if (errorMsg.length > 50) {
        errorMsg = errorMsg.slice(0, 50) + "...";
      }
      message.error("Transaction failed：" + errorMsg); // 交易失败：
    }
    return { value: false };
  }
}
export default useContractSend;
