// NetworkRequest.ts
import { message } from "antd";
// const RequestUrl = "https://api.habitld.top/dapp/";
const RequestUrl = "https://api.soulca.com/";
// const RequestUrl = "http://143.92.39.28:9030/api/";
interface NetWorkProps {
    Url: string;
    Method?: "get" | "post" | "put" | "delete";
    Data?: Record<string, any>;
    showLoading?: boolean;
}

async function NetworkRequest(params: NetWorkProps): Promise<any> {
    const {
        Url,
        Method = "get",
        Data = {},
    } = params;

    let url = Url;
    const method = Method.toLowerCase();
    const key = "globalLoading";

    try {

        if (method === "get" && Object.keys(Data).length > 0) {
            const queryString = new URLSearchParams(Data).toString();
            url += "?" + queryString;
        }

        const response = await fetch(RequestUrl + url, {
            method: method.toUpperCase(),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") || ""
            },
            body: method === "get" ? null : JSON.stringify(Data),
        });

        const result = await response.json();
        if(result.code === 401) {
            localStorage.removeItem("token");
            window.location.reload();
        }else if (!response.ok || result.code !== 200) {
            throw new Error(result.msg || "Request Error");
        }
        return { success: true, data: result };
    } catch (error: any) {
        message.error({ content: "Request Error：" + (error.message || error), key });
        return { success: false, error: error.message || error };
    }
}

export default NetworkRequest;