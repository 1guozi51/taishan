import { message } from "antd";
import { ethers, BigNumber } from "ethers";
/**
 * 格式化钱包地址
 * @param addr 钱包地址
 * @param prefixLen 前缀长度，默认 7
 * @param suffixLen 后缀长度，默认 4
 * @returns 格式化后的地址，例如：0x1234567....abcd
 */
export function formatAddress(
  addr?: string,
  prefixLen = 7,
  suffixLen = 4
): string {
  if (!addr) return "";
  return `${addr.slice(0, prefixLen)}....${addr.slice(-suffixLen)}`;
}

/**
 * 检查是否是有效的以太坊地址
 * @param addr 钱包地址
 * @returns 如果是有效地址返回 true，否则 false
 */
export function isValidAddress(addr?: string): boolean {
  if (!addr) return false;
  try {
    return ethers.utils.isAddress(addr);
  } catch {
    return false;
  }
}

/**
 * 将最小单位（如 wei）转换为人类可读的格式（如 ETH）
 * @param value 要转换的值，可以是 string | number | bigint
 * @param decimals 小数位数，默认 18（Ether）
 * @param fixed 是否固定为小数位数（默认保留 4 位）
 * @returns 格式化后的字符串
 */
export function fromWei(
  value: string | number | bigint|BigNumber,
  decimals = 18,
  fixed = true,
  precision = 4
): string {
  if (value === undefined || value === null) return "0";
  try {
    const etherValue = ethers.utils.formatUnits(value.toString(), decimals);

    if (!fixed) return etherValue;

    return truncateDecimal(etherValue, precision);
  } catch (error) {
    console.error("fromWei 转换失败:", error);
    return "0";
  }
}

function truncateDecimal(value: string, decimals: number): string {
  if (!value.includes('.')) return value;

  const [integer, fraction = ''] = value.split('.');
  const truncated = fraction.slice(0, decimals);
  return `${integer}.${truncated.padEnd(decimals, '0')}`;
}

/**
 * 将 Ether 或代币单位转换为最小单位（如 wei）
 * @param value 字符串或数字
 * @param decimals 小数位数（默认为 18）
 * @returns 最小单位的 bigint 值
 */
export function toWei(
  value: string | number | bigint,
  decimals = 18
): BigNumber {
  if (value === undefined || value === null) return BigNumber.from(0);
  try {
    return ethers.utils.parseUnits(value.toString(), decimals);
  } catch (error) {
    console.error("toWei 转换失败:", error);
    return BigNumber.from(0);
  }
}

// 钱包地址截取
export function SubAddress(address: string): string | null {
  if (address) {
    return (
      address.substr(0, 4) +
      "..." +
      address.substr(address.length - 4, address.length)
    );
  } else {
    return null;
  }
}

// 全局消息通知
export function Totast(
  Message: string,
  type: "success" | "error" | "info" | "warning" | "loading"
) {
  switch (type) {
    case "success":
      message.success(Message);
      break;
    case "error":
      message.error(Message);
      break;
    case "info":
      message.info(Message);
      break;
    case "warning":
      message.warning(Message);
      break;
    case "loading":
      message.loading(Message);
      break;
    default:
      message.info(Message);
  }
}

// 小数点截取
export function DecSubt(Num: string, len: number) {
  if (Num.indexOf(".") != -1) {
    const NumArr = Num.split(".");
    const Head = NumArr[0];
    const foot = NumArr[1];
    if (foot.length > len) {
      const footSub = foot.substring(0, len);
      return Head + "." + footSub;
    } else {
      return Num;
    }
  } else {
    return Num;
  }
}

// 代币名称
export function TokenName() {
  return "BRT";
}

export function formatDate(dateString) {
  // 解析 ISO 格式的日期字符串
  const date = new Date(dateString);

  // 获取日期部分：MM/DD/YYYY
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以加 1
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  const formattedDate = `${month}/${day}/${year}`;

  // 获取时间部分：HH:mm:ss
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  // 返回包含日期和时间的对象
  return {
    date: formattedDate,
    time: formattedTime,
    dateTime:formattedDate+' '+formattedTime
  };
}
export async function ensureBNBChain(): Promise<boolean> {
  const { ethereum } = window;

  if (!ethereum) {
    message.error("未检测到钱包环境");
    return false;
  }

  try {
    const currentChainId = await ethereum.request({ method: "eth_chainId" });
    if (currentChainId === "0x38") {
      // 已经在BNB链
      return true;
    }
    // 请求切换到BNB主网（Metamask中默认已配置）
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }],
    });
    return true;
  } catch (error) {
    const err = error as Error;
    message.error("请手动切换至 BNB 主链：" + err.message);
    return false;
  }
}
 
