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
import { UseSignMessage } from "@/Hooks/UseSignMessage.ts";
import { concatSign } from "@/Hooks/Utils.ts";
import { Totast, fromWei, SubAddress, formatDate } from "@/Hooks/Utils.ts";
import { useNavigate } from "react-router-dom";

import {
  defaultUserInfo,
  fillNullWithDefault,
} from "@/components/Menu/type.ts";
import BackHeader from "@/components/BackHeader";
import { t } from "i18next";
import noNode from "@/assets/img/noNode.png";
import CloudNode from "@/assets/img/CloudNode.png";
import { Button } from "antd-mobile";
import type { UserInfo } from "@/Hooks/InterFaceHooks";
const MyNode: React.FC = () => {
  const navigate = useNavigate();
  const walletAddress = userAddress().address;
  // const walletAddress = '0x1c028e874b6071194da0e24d1504507f717d2588';
  const { signMessage } = UseSignMessage(); //获取钱包签名
  const nodeList = [
    {
      id: 0,
      value: "0",
      nodeImg: nodeImg,
      name: t("社区节点"),
      list: [
        t("全网购买门票的5%均分大超级节点"),
        t("30000U矿机放大4倍12万U额度"),
        t("全网动静产币均分2%"),
        t("全网众筹静态10%产出总额2%"),
        t("获得F7会员等级(限时3个月)"),
      ],
    },
    {
      id: 1,
      value: "4",
      nodeImg: nodeImg,
      name: t("社区节点"),
      list: [
        t("全网购买门票的5%均分大超级节点"),
        t("30000U矿机放大4倍12万U额度"),
        t("全网动静产币均分2%"),
        t("全网众筹静态10%产出总额2%"),
        t("获得F7会员等级(限时3个月)"),
      ],
    },
    {
      id: 2,
      value: "3",
      nodeImg: nodeImg1,
      name: t("超级节点"),
      list: [
        t("3000U矿机放大3倍10000U矿机放大3倍3万U额度"),
        t("全网动静产币均分2%"),
        t("全网众筹静态10%产出总额x 1%"),
        t("获得F6会员等级(限时3个月)"),
      ],
    },
    {
      id: 3,
      value: "2",
      nodeImg: nodeImg2,
      name: t("大节点"),
      list: [
        t("3000U矿机放大3倍9000U额度"),
        t("全网动静产币均分2%"),
        t("全网众筹静态10%产出总额x 1%"),
        t("获得F4会员等级(限时3个月)"),
      ],
    },
    {
      id: 4,
      nodeImg: nodeImg3,
      value: "1",
      name: t("小节点"),
      list: [
        t("500U矿机放大3倍1500U额度"),
        t("全网动静产币均分3%"),
        t("全网众筹静态10%产出总额x 1%"),
        t("获得F2会员等级(限时3个月)"),
      ],
    },
  ];
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [teamInfo, setTeamInfo] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  //是否购买节点
  const [nodeState, setNodeState] = useState<boolean>(false);
  //节点信息
  const [nodeInfo, setNodeInfo] = useState<any | null>(null);
  //获取页面数据
  const getPageData = async () => {
    const infoResult = await Promise.allSettled([
      //得到用户数据
      NetworkRequest({
        Url: "user/info",
        Data: { address: walletAddress },
      }),
      NetworkRequest({
        Url: "user/teamInfo",
        Data: {
          address: walletAddress,
        },
      }),
    ]);
    setUserInfo(infoResult[0].value.data.data);

    //获取团队信息
    setTeamInfo(infoResult[1].value.data.data);
  };
  //得到当前等级信息 图标 节点名称 对应的专属权益
  useEffect(() => {
    //得到对应节点信息 展示相关内容
    console.log("userInfo=useEffect=", userInfo);
    let nodeLevel = userInfo.nodeLevel || 0;
    if (nodeLevel == 0) {
      setNodeState(false);
    } else {
      const found = nodeList.find((item) => item.value == nodeLevel);
      setNodeInfo(found);
      setNodeState(true);
    }
  }, [userInfo]);
 
  //跳转页面
  const PathNav = (url) => {
    navigate(url);
  };
  //待领取奖励 type 领取对应类型的奖励
  const claimTeamClick = async (type, amount) => {
    if (fromWei(amount) == 0) {
      Totast("不能领取", "warning");
      return;
    }
    if (btnLoading) return; // 防止重复点击
    const bigRes = concatSign(fromWei(amount));
    setBtnLoading(true);
    const sigResult = await signMessage(bigRes);
    if (sigResult) {
      await NetworkRequest({
        Url: "userRecord/claimTeam",
        Method: "POST",
        Data: {
          address: walletAddress,
          type,
          msg: bigRes,
          signature: sigResult,
        },
      })
        .then((res) => {
          Totast("领取成功", "success");
          getPageData();
        })
        .finally(() => {
          setBtnLoading(false);
        });
    } else {
      setBtnLoading(false);
    }
  };
  useEffect(() => {
    getPageData();
  }, []);
  return (
    <>
      <BackHeader title="节点" />
      <div className="nodeBox">
        {nodeState == true ? (
          <>
            <div className="nodeImg">
              <img src={nodeInfo?.nodeImg} alt="" />
              <div>{nodeInfo?.name}</div>
            </div>
            <div className="CloudNode">
              <img src={CloudNode} alt="" />
              <span>CLOUDAI NODE NUMBER</span>
              <div>{fromWei(userInfo.teamNodePerf) || 0}</div>
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
            <div>{t("累计领取收益")}(USDT)</div>
            <div>{fromWei(teamInfo.nodeUsdtReward)}</div>
            <Button
              onClick={() => {
                PathNav("/recordList?type=team&id=103");
              }}
            >
              {t("明细")}
            </Button>
          </div>
          <div className="record boxBorder">
            <div>{t("待领取收益")}(USDT)</div>
            <div>{fromWei(teamInfo.nodeUsdtClaimReward)}</div>
            <Button
              disabled={btnLoading}
              onClick={() => {
                claimTeamClick(103, teamInfo.nodeUsdtClaimReward);
              }}
            >
              {t("领取")}
            </Button>
          </div>
        </div>

        <div className="awardButton">
          <div className="record boxBorder">
            <div>{t("累计领取收益")}(CA)</div>
            <div>{fromWei(teamInfo.nodeCaReward)}</div>
            <Button
              onClick={() => {
                PathNav("/recordList?type=team&id=104");
              }}
            >
              {t("明细")}
            </Button>
          </div>
          <div className="record boxBorder">
            <div>{t("待领取收益")}(CA)</div>
            <div>{fromWei(teamInfo.nodeCaClaimReward)}</div>
            <Button
              disabled={btnLoading}
              onClick={() => {
                claimTeamClick(104, teamInfo.nodeCaClaimReward);
              }}
            >
              {t("领取")}
            </Button>
          </div>
        </div>
        {nodeState == true ? (
          <>
            <div className="equityBox">
              <div className="title">{t("专属权益")}</div>
              {nodeInfo?.list.map((item, index) => {
                return (
                  <div key={index}>
                    {" "}
                    <img src={equityIcon} alt="" /> {item}{" "}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* <Button
              className="payNode"
              onClick={() => {
                PathNav("/node");
              }}
            >
              {t("选购节点")}
            </Button> */}
          </>
        )}
      </div>
    </>
  );
};

export default MyNode;
