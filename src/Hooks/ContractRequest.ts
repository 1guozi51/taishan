import ContractList from "../Contract/Contract.ts";
import { ethers } from 'ethers';

interface ContractParams {
    tokenName: string;
    methodsName: string;
    params: any[];
}

interface  ContractObje {
    address: string;
    abi: Array<any>
}

interface ContractResult{
    value: any
}

async function useContractRequest({tokenName, methodsName, params}: ContractParams): Promise<ContractResult> {
    try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contractInfo:ContractObje = ContractList[tokenName];
        const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, provider);
        const Result = await contract[methodsName](...params);
        return { value:Result };
    }catch (error){
        console.log(error);
        return { value:false };
    }
}

export default useContractRequest