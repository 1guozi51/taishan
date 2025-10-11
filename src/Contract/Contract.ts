import Erc20 from "./ABI/Erc20.ts";
import CaPoolABI from "./ABI/CaPoolABI.ts";

interface ContractItem {
    address: string;
    abi: any[]; // 或具体ABI类型
}
interface ContractMap {
    [key: string]: ContractItem;
}
// 测试
const Contract:ContractMap = {
    "USDTToken": {
        "address": "0x55d398326f99059fF775485246999027B3197955",
        "abi": Erc20
    },
    "CaToken": {
        "address": "0x7e0060dD72eBBc2dbA1A1498905657874c6064d3",
        "abi": Erc20
    },
    "CaPool": {
        "address": "0xf3f27128C8596915093439671cF223978AA3abae",
        "abi": CaPoolABI
    }
}
// 正式
export default Contract