import "./index.scss";
import { useState, useEffect } from "react";
import equityIcon from "@/assets/img/equityIcon.png";
import nodeImg from "@/assets/img/nodeImg.png";
import nodeImg1 from "@/assets/img/nodeImg1.png";
import nodeImg2 from "@/assets/img/nodeImg2.png";
import nodeImg3 from "@/assets/img/nodeImg3.png";
import closeImg from "@/assets/img/closeImg.png";
import popNodeBg from "@/assets/img/popNodeBg.png";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { defaultUserInfo, fillNullWithDefault } from "@/components/Menu/type.ts";

import { t } from "i18next";
import noNode from "@/assets/img/noNode.png";
import CloudNode from "@/assets/img/CloudNode.png";
import { Button } from "antd-mobile";
interface UserInfo {
  activate: string | null;
  address: string | null;
  caBalance: number | null;
  caReward: number | null;
  communityPerf: number | null;
  createTime: string | null;
  directCount: number | null;
  directTotalCount: number | null;
  inviterAddress: string | null;
  layer: number | null;
  nodeLevel: number | null;
  parentAddress: string | null;
  selfInvest: number | null;
  sort: number | null;
  teamCount: number | null;
  teamNodePerf: number | null;
  teamPerf: number | null;
  teamReward: number | null;
  usdtBalance: number | null;
  userLevel: number | null;
}
const MyNode: React.FC = () => {
  const walletAddress = userAddress().address;

  const nodeList = [
    {
      id: 1,
      name: "超级节点",
      list: [
        "10000U矿机放大3倍3万U额度",
        "全网动静产币均红2%",
        "全网众筹静态10%产出总额x 1%",
        "获得F6会员等级(限时3个月)",
      ],
    },
    {
      id: 2,
      name: "大节点",
      list: [
        "3000U矿机放大3倍9000U额度",
        "全网动静产币均红2%",
        "全网众筹静态10%产出总额x 1%",
        "获得F4会员等级(限时3个月)",
      ],
    },
    {
      id: 3,
      name: "小节点",
      list: [
        "500U矿机放大3倍1500U额度",
        "全网动静产币均红3%",
        "全网众筹静态10%产出总额x 1%",
        "获得F2会员等级(限时3个月)",
      ],
    },
  ];

  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);

  const [nodeState, setNodeState] = useState<boolean>(true);

  const getPageData = async () => {
    await NetworkRequest({
      Url: "user/info",
      Data: { address: walletAddress },
    }).then((res) => {
     console.log("userInfo=",res) 
      
      if (res.data.code == 200) {
        setUserInfo(
          fillNullWithDefault<UserInfo>(res.data.data, defaultUserInfo)
        );
      }
    });
     console.log("userInfo=",userInfo) 
  };
  useEffect(() => {
    getPageData();
  }, []);
  return (
    <>
      <div className="nodeBox">
        {nodeState ? (
          <>
            <div className="nodeImg">
              <img src={nodeImg} alt="" />
              <div>{t("普通节点")}</div>
            </div>
            <div className="CloudNode">
              <img src={CloudNode} alt="" />
              <span>CLOUDAI NODE NUMBER</span>
              <div>0</div>
            </div>
          </>
        ) : (
          <>
            <div className="nodeImg">
              <img src={noNode} alt="" />
              <div>{t("暂无节点,请购买")}</div>
            </div>
          </>
        )}
        <div className="awardButton">
          <div className="record boxBorder">
            <div>{t("累计领取收益")}(CAR)</div>
            <div>0</div>
            <Button>{t("明细")}</Button>
          </div>
          <div className="record boxBorder">
            <div>{t("待领取收益")}(CAR)</div>
            <div>0</div>
            <Button>{t("领取")}</Button>
          </div>
        </div>
        {nodeState ? (
          <>
            <div className="equityBox">
              <div className="title">{t("专属权益")}</div>
              <div>
                {" "}
                <img src={equityIcon} alt="" /> {t("10000U矿机放大3倍3万U额度")}{" "}
              </div>
              <div>
                {" "}
                <img src={equityIcon} alt="" /> {t("全网动静产币均分红2%")}
              </div>
              <div>
                {" "}
                <img src={equityIcon} alt="" />{" "}
                {t("全网众筹静态10%产出总额x 1%")}{" "}
              </div>
              <div>
                {" "}
                <img src={equityIcon} alt="" /> {t("获得F6会员等级(限时3个月)")}{" "}
              </div>
            </div>
          </>
        ) : (
          <>
            <Button className="payNode" onClick={() => {}}>
              {t("选购节点")}
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default MyNode;
