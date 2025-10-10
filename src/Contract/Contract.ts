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
        "address": "0x81097251B331564Cc418A1d5B05Af8ec2E1E5437",
        "abi": CaPoolABI
    }
}
// 正式
export default Contract