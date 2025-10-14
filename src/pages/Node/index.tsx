import "./index.scss";
import React from "react";
import equityIcon from "@/assets/img/equityIcon.png";
import { useState } from "react";
import { Button } from "antd-mobile";
import { nodeBuyList } from "@/config/nodeList";
import BuyNodePopup from "./components/BuyNodePopup";
import { userAddress } from "@/Store/Store.ts";

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
  return (
    <>
      <div className="nodeBox">
        <div className="nodeContent">
          <div>5560</div>
          <div>CloudAi全球节点总数</div>
          <div>未售节点：1280</div>
        </div>
        {nodeBuyList.map((e, index) => {
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