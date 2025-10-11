import Erc20 from "./ABI/Erc20.ts";
import CaPoolABI from "./ABI/CaPoolABI.ts";
import { CONFIG } from "@/config/env";
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
        "address": CONFIG.contractUSDT,
        "abi": Erc20
    },
    "CaToken": {
        "address": CONFIG.contractCA,
        "abi": Erc20
    },
    "CaPool": {
        "address": CONFIG.contractPool,
        "abi": CaPoolABI
    }
}
// 正式
export default Contract