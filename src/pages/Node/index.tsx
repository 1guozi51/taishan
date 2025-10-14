import "./index.scss";
import { useState, useEffect } from "react";
import equityIcon from "@/assets/img/equityIcon.png";
import { Button } from "antd-mobile";
import { nodeBuyList } from "@/config/nodeList";
import BuyNodePopup from "./components/BuyNodePopup";
import { userAddress } from "@/Store/Store.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { ethers } from "ethers";
interface NodeListClass {
  id: number;
  name: string;
  number: number;
  price: number;
  content: string[];
}
const MyNode: React.FC = () => {
  //获取的地址
  const wallertAddress = userAddress().address;
  // 当前用户是否为节点
  const [userIsNode, setUserIsNode] = useState(false);

  const [nodeState, setNodeState] = useState<boolean>(false);

  const [nodePopState, setnodePopState] = useState<boolean>(false);

  // 选中的节点索引
  const [selectNodeIndex, setSelectNodeIndex] = useState<boolean>(false);
  // 股东节点
  const [supNodeAddress] = useState<string[]>([
    "0xc6626ecd5e2f39a90b0d83f1abad2ec01a061c9c",
    "0x457869cc033f95de9d5579929d15be1059861ecd",
  ]);
// 购买按钮加载
  const [butLoding, setButLoding] = useState(false);
  // 购买选中的节点
  const [selectNodeItem, setSelectNodeItem] = useState<NodeListClass>();
  // 界面显示 1购买节点 2我的节点
  const [showNodeContent, setShowNodeContent] = useState<number>(1);
  // 用户购买的节点数
  const [userBuyNodeId, setUserBuyNodeId] = useState<number>(-1);


   const [nodeList, setNodeList] = useState<NodeListClass[]>(nodeBuyList);
  // 查询当前用户是否为节点
  const searchUserIsNode = async () => {
    setButLoding(true);
    const promiseSend = [];
    promiseSend.push(
      ContractRequest({
        tokenName: "idoPool",
        methodsName: "nodeInfo",
        params: [wallertAddress],
      })
    );
    nodeList.map((item: NodeListClass) => {
      promiseSend.push(
        ContractRequest({
          tokenName: "idoPool",
          methodsName: "poolInfo",
          params: [item.id],
        })
      );
    });

    const Result = await Promise.allSettled(promiseSend);
    console.log("result==", Result);
   
    return
    if (Result[0].status === "fulfilled") {
      const result = Result[0].value.value;
      console.log(result);
      setUserIsNode(result.isNode);
      if (result.isNode) {
        setUserBuyNodeId(parseInt(result.pid.toString()));
      }
    }
    if (Result[1].status === "fulfilled") {
      const result = Result[1].value.value;
      console.log(result);
      setNodeList((prev) => {
        const newList = [...prev];
        newList[0] = {
          ...newList[0],
          price: Number(ethers.utils.formatUnits(result.amount)),
        };
        return newList;
      });
    }
    if (Result[2].status === "fulfilled") {
      const result = Result[2].value.value;
      console.log(result);
      setNodeList((prev) => {
        const newList = [...prev];
        newList[1] = {
          ...newList[1],
          price: Number(ethers.utils.formatUnits(result.amount)),
        };
        return newList;
      });
    }
    if (Result[3].status === "fulfilled") {
      const result = Result[3].value.value;
      console.log(result);
      setNodeList((prev) => {
        const newList = [...prev];
        newList[2] = {
          ...newList[2],
          price: Number(ethers.utils.formatUnits(result.amount)),
        };
        return newList;
      });
    }
    console.log("nodeList===", nodeList);
    setButLoding(false);
  };
  useEffect(() => {
    searchUserIsNode();
  }, []);
  return (
    <>
      <div className="nodeBox">
        <div className="nodeContent">
          <div>5560</div>
          <div>CloudAi全球节点总数</div>
          <div>未售节点：1280</div>
        </div>
        {nodeList.map((e, index) => {
          return (
            <div className="nodeItem boxBorder" key={index}>
              <div className="title">
                <img src={e.nodeImg} alt="" />
                <div> {e.name} </div>
                {/* <div>剩余2 </div> */}
                <div>
                  {" "}
                  <span>限量</span> <span>{e.number}个 </span>
                </div>
              </div>
              <div className="equityBox">
                <div className="title">专属权益</div>
                {e.list.map((e, index) => {
                  return (
                    <div key={index}>
                      {" "}
                      <img src={equityIcon} alt="" /> {e}{" "}
                    </div>
                  );
                })}
              </div>
              <div className="Bottom">
                <div> {e.price} USDT/个 </div>
                <Button
                  className="coloursBT"
                  onClick={() => setnodePopState(true)}
                  style={{ width: "92px", height: "32px" }}
                >
                  购买
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <BuyNodePopup
        popState={nodePopState}
        setPopState={() => setnodePopState(false)}
        setNodeState={() => setNodeState(true)}
      ></BuyNodePopup>
    </>
  );
};
export default MyNode;
