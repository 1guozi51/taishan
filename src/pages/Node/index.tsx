import "./index.scss";
import { useState, useEffect } from "react";
import equityIcon from "@/assets/img/equityIcon.png";
import { Button, Modal } from "antd-mobile";
import { Spin } from "antd";
import Header from "@/components/Header";
import { nodeBuyList } from "@/config/nodeList";
import BuyNodePopup from "./components/BuyNodePopup";
import { userAddress } from "@/Store/Store.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { fromWei } from "@/Hooks/Utils";
import { useNavigate } from "react-router-dom";
import { BigNumber } from "ethers";
import { t } from "i18next";
interface NodeListClass {
  id: number;
  name: string;
  number: number;
  price: BigNumber;
  balance: BigNumber;
  nodeImg: string;
  list: string[];
  value: string;
}
const MyNode: React.FC = () => {
  const navigate = useNavigate();
  //获取的地址
  const wallertAddress = userAddress().address;
  // 当前用户是否为节点
  const [userIsNode, setUserIsNode] = useState(false);

  const [nodeState, setNodeState] = useState<boolean>(false);

  const [nodePopState, setNodePopState] = useState<boolean>(false);

  // 股东节点
  const [supNodeAddress] = useState<string[]>([
    "0xc6626ecd5e2f39a90b0d83f1abad2ec01a061c9c",
    "0x457869cc033f95de9d5579929d15be1059861ecd",
  ]);
  // 数据是否加载完成
  const [butLoding, setButLoding] = useState(true);
  // 购买选中的节点
  const [selectNodeItem, setSelectNodeItem] = useState<NodeListClass>();
  // 用户购买的节点数
  const [userBuyNodeId, setUserBuyNodeId] = useState<number>(-1);
  const [usdtBalance, setUsdtBalance] = useState<BigNumber>(BigNumber.from(0));
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
    promiseSend.push(
      ContractRequest({
        tokenName: "USDTToken",
        methodsName: "balanceOf",
        params: [wallertAddress],
      })
    );
    const Result = await Promise.allSettled(promiseSend);
    if (Result[0].status === "fulfilled") {
      const result = Result[0].value.value;
      setUserIsNode(result.isNode);
      if (result.isNode) {
        setUserBuyNodeId(parseInt(result.pid.toString()));
      }
    }
    if (Result[1].status === "fulfilled") {
      const result = Result[1].value.value;
      setNodeList((prev) => {
        const newList = [...prev];
        newList[0] = {
          ...newList[0],
          price: result.amount,
          balance: result.balance,
        };
        return newList;
      });
    }
    if (Result[2].status === "fulfilled") {
      const result = Result[2].value.value;
      setNodeList((prev) => {
        const newList = [...prev];
        newList[1] = {
          ...newList[1],
          price: result.amount,
          balance: result.balance,
        };
        return newList;
      });
    }
    if (Result[3].status === "fulfilled") {
      const result = Result[3].value.value;
      setNodeList((prev) => {
        const newList = [...prev];
        newList[2] = {
          ...newList[2],
          price: result.amount,
          balance: result.balance,
        };
        return newList;
      });
    }
    if (Result[4].status === "fulfilled") {
      const result = Result[4].value.value;
      setUsdtBalance(result);
    }
    setButLoding(false);
  };

  //购买成功弹窗返回购买节点的信息
  const buySuccessChange = (e) => {
    searchUserIsNode()
    const handler = Modal.show({
      title: t('欢迎加入'),
      closeOnMaskClick: true,
      bodyClassName: "successPop",
      content: (
        <>
          <div className="title2">{t('CloudFAi全球节点')}</div>
          <div className="payNode">
            <img src={e.nodeImg} alt="" />
            <div className="text">{t('获得')}{e.name}</div>
          </div>
          <Button
            className="btn coloursBT"
            onClick={() => {
              handler.close();
              navigate("/myNode");
            }}
          >
            {t('查看节点中心')}
          </Button>
        </>
      ),
    });
  };
  const buyNodeClick = (e: NodeListClass) => {
    setSelectNodeItem(e);
    setNodePopState(true);
  };
  useEffect(() => {
    searchUserIsNode();
  }, []);
  return (
    <>
      <Header title={t('节点')}/>
      {butLoding ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <div className="nodeBox">
          <div className="nodeContent">
            <div>5550</div>
            <div>{t('CloudFAi全球节点总数')}</div>
          </div>
          {nodeList.map((e, index) => {
            return (
              <div className="nodeItem boxBorder" key={index}>
                <div className="title">
                  <img src={e.nodeImg} alt="" />
                  <div> {e.name} </div>
                  <div>
                    {" "}
                    <span>{t('限量')}</span> <span>{e.number}{t('个')} </span>
                  </div>
                </div>
                <div className="equityBox">
                  <div className="title">{t('专属权益')}</div>
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
                  <div> {fromWei(e.price)} USDT/{t('个')} </div>
                  <Button
                    disabled={userIsNode}
                    className="coloursBT"
                    onClick={() => buyNodeClick(e)}
                    style={{ width: "92px", height: "32px" }}
                  >
                    {t('购买')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {nodePopState ? (
        <BuyNodePopup
          popState={nodePopState}
          selectNodeItem={selectNodeItem}
          usdtBalance={usdtBalance}
          buySuccessChange={buySuccessChange}
          setPopState={() => setNodePopState(false)}
          setNodeState={() => setNodeState(true)}
        ></BuyNodePopup>
      ) : null}
    </>
  );
};
export default MyNode;
