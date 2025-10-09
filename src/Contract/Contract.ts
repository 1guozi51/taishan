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
        "address": "0x8873bB4707351279e921637f0700BE5f9cef1b1B",
        "abi": Erc20
    },
    "CaToken": {
        "address": "0x7e0060dD72eBBc2dbA1A1498905657874c6064d3",
        "abi": Erc20
    },
    "CaPool": {
        "address": "0x8772fD1C9Bf29B93976A7b04d3013EC03f92c43f",
        "abi": CaPoolABI
    }
}

// 正式

export default Contract