import ContractList from "../Contract/Contract.ts";
import { ethers } from 'ethers';

interface ContractParams {
    tokenName: string;
}

interface  ContractObje {
    address: string;
    abi: Array<any>
}

interface ContractResult{
    value: any
}

async function useContractRead({tokenName}: ContractParams): Promise<ContractResult> {
    try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contractInfo:ContractObje = ContractList[tokenName];
        const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, provider);
        return { value:contract };
    }catch (error){
        return { value:false };
    }
}

export default useContractRead