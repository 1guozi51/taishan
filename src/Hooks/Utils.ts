import { message } from "antd"

// 钱包地址截取
export function SubAddress(address: string): string | null {
    if(address) {
        return address.substr(0,4) + '...' + address.substr(address.length - 4,address.length);
    }else{
        return null;
    }
}

// 全局消息通知
export function Totast(Message: string, type: 'success' | 'error' | 'info' | 'warning' | 'loading') {
    switch(type) {
        case 'success':
            message.success(Message);
            break;
        case 'error':
            message.error(Message);
            break;
        case 'info':
            message.info(Message);
            break;
        case 'warning':
            message.warning(Message);
            break;
        case 'loading':
            message.loading(Message);
            break;
        default:
            message.info(Message);
    }
}

// 小数点截取
export function DecSubt(Num:string,len: number) {
    if(Num.indexOf(".") != -1) {
        const NumArr = Num.split('.');
        const Head = NumArr[0];
        const foot = NumArr[1]
        if(foot.length > len) {
            const footSub = foot.substring(0,len);
            return Head + "." + footSub;
        }else{
            return Num
        }
    }else{
        return Num
    }
}

// 代币名称
export function TokenName() {
    return "BRT";
}

export async function ensureBNBChain(): Promise<boolean> {
    const { ethereum } = window;

    if (!ethereum) {
        message.error("未检测到钱包环境");
        return false;
    }

    try {
        const currentChainId = await ethereum.request({ method: 'eth_chainId' });
        if (currentChainId === '0x38') {
            // 已经在BNB链
            return true;
        }
        // 请求切换到BNB主网（Metamask中默认已配置）
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }]
        });
        return true;
    } catch (error) {
        const err = error as Error;
        message.error("请手动切换至 BNB 主链：" + err.message);
        return false;
    }
}