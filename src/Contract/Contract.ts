import Erc20 from "./ABI/Erc20.ts";
import CaPoolABI from "./ABI/CaPoolABI.ts";
import EnvManager from "@/config/EnvManager";
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
        "address": EnvManager.contractUSDT,
        "abi": Erc20
    },
    "CaToken": {
        "address": EnvManager.contractCA,
        "abi": Erc20
    },
    "CaPool": {
        "address": EnvManager.contractPool,
        "abi": CaPoolABI
    }
}
// 正式
export default Contract