import Erc20 from "./ABI/Erc20.ts";
import IdoABI from "./ABI/IdoABI.ts";
import IdoABI2 from "./ABI/IdoABI2.ts";

interface ContractItem {
    address: string;
    abi: any[]; // 或具体ABI类型
}
interface ContractMap {
    [key: string]: ContractItem;
}
// 测试
const Contract:ContractMap = {
    // "USDTToken": {
    //     "address": "0x55d398326f99059fF775485246999027B3197955",
    //     "abi": Erc20
    // },

    // "IDO": {
    //     "address": "0x77C596103cc479eaCBe5862B514C18C5CCCd35a8",
    //     "abi": IdoABI
    // }

    "USDTToken": {
        "address": "0x8873bB4707351279e921637f0700BE5f9cef1b1B",
        "abi": Erc20
    },
    "CaToken": {
        "address": "0x7e0060dD72eBBc2dbA1A1498905657874c6064d3",
        "abi": Erc20
    },
    "IDO": {
        "address": "0x77C596103cc479eaCBe5862B514C18C5CCCd35a8",
        "abi": IdoABI
    },
    "IDO2": {
        "address": "0x45100C10d4577390B82fDf2c91aAdb39Dd1FF448",
        "abi": IdoABI2
    }
}

// 正式

export default Contract