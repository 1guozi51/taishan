import "./index.scss";
import React from "react";
import equityIcon from "@/assets/img/equityIcon.png";
import nodeImg from "@/assets/img/nodeImg.png";
import nodeImg1 from "@/assets/img/nodeImg1.png";
import nodeImg2 from "@/assets/img/nodeImg2.png";
import nodeImg3 from "@/assets/img/nodeImg3.png";
import closeImg from "@/assets/img/closeImg.png";
import popNodeBg from "@/assets/img/popNodeBg.png";
import { t } from "i18next";

import noNode from "@/assets/img/noNode.png";
import CloudNode from "@/assets/img/CloudNode.png";
import { useState } from "react";
import { Button } from "antd-mobile";
const MyNode: React.FC = () => {
  const [nodeState, setNodeState] = useState<boolean>(true);
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
                <img src={equityIcon} alt="" />{" "}
                {t("10000U矿机放大3倍3万U额度,0.8%每日释放删除掉")}{" "}
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
