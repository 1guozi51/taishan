import Erc20 from "./ABI/Erc20.ts";
import CaPoolABI from "./ABI/CaPoolABI.ts";
import IdoABI from "./ABI/IdoABI.ts";
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
        "address": EnvManager.contractUsdt,
        "abi": Erc20
    },
    "CaToken": {
        "address": EnvManager.contractCa,
        "abi": Erc20
    },
    "CaPool": {
        "address": EnvManager.contractPool,
        "abi": CaPoolABI
    },
    "idoPool":{
         "address": EnvManager.contractIdoPool,
        "abi": IdoABI
    },
    "swapRouter":{
         "address": EnvManager.swapRouter,
        "abi": CaPoolABI
    }
}
// 正式
export default Contract