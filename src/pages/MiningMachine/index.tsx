import "./index.scss";
import { useEffect, useState } from "react";
import { userAddress } from "@/Store/Store.ts";
import Header from "@/components/Header";
import Item from "./components/item/index";
import { fromWei, Totast } from "@/Hooks/Utils";
import { Spin } from "antd";
import { t } from "i18next";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { BigNumber } from "ethers";
import type { MinerInfo } from "@/Hooks/InterFaceHooks.ts";
import ContractSend from "@/Hooks/ContractSend.ts";
import NoData from "@/components/NoData";
interface TabItem {
  id: number;
  name: string;
}

const tabArray: TabItem[] = [
  {
    id: 0,
    name: t("全部"),
  },
  {
    id: 1,
    name: t("挖矿中"),
  },
  {
    id: 2,
    name: t("已完成"),
  },
];
const MiningMachine: React.FC = () => {
  const wallertAddress = userAddress().address;
  const [minerInfo, setMinerInfo] = useState<MinerInfo>();

  const [pending, setPending] = useState<BigNumber>(BigNumber.from(0));
  

  //领取loading
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const [list, setList] = useState([]);
//tab下标
  const [tabIndex, setTabIndex] = useState<number>(0);
  const tabIndexChange = (index) => {
    setTabIndex(index);
  };
  const getPageData = async () => {
    console.log("wallertAddress==", wallertAddress);
    const Result = await Promise.allSettled([
      ContractRequest({
        tokenName: "CaPool",
        methodsName: "minerInfo",
        params: [wallertAddress],
      }),
      ContractRequest({
        tokenName: "CaPool",
        methodsName: "pending",
        params: [wallertAddress],
      }),
    ]);
    if (Result[0].status == "fulfilled") {
      const {
        value,
        powerValue,
        time,
        per,
        releaseValueDebt,
        releaseCaAmount,
        totalMaxValue,
        totalReleaseCaAmount,
        flg,
      } = Result[0].value?.value || {};
      setMinerInfo({
        value,
        powerValue,
        time,
        per,
        releaseValueDebt,
        releaseCaAmount,
        totalMaxValue,
        totalReleaseCaAmount,
        flg,
      });
    }
    if (Result[1].status == "fulfilled") {
      const isPending = Result[1].value?.value || BigNumber.from(0);
      setPending(isPending);
    }
  };
  //领取收益
  const getClaim = async () => {
    if (buttonLoading) {
      return;
    }
    if (pending.toString() == "0") {
      Totast(t("不能领取"), "warn");
      return;
    }
    setButtonLoading(true);

    const res = await ContractSend({
      tokenName: "CaPool",
      methodsName: "claim",
      params: [],
    });
    if (res.value) {
      //领取成功刷新数据
      getPageData();
    }
    setButtonLoading(false);
  };
  useEffect(() => {
    getPageData();
  }, []);
  return (
    <div className="mining-machine-page">
      <Header
        title={t('我的矿机')}
        recordText={t('领取记录')}
        fixed={false}
        recordUrl="/recordList?type=miningMachine&id=1"
      />
      <div className="content">
        <div className="card-txt-box">{t('算力矿机')}</div>
        <div className="card-box">
          <div className="card-option">
            <div className="card-nums">
              {t('矿机算力')}：{fromWei(minerInfo?.powerValue)}  
            </div>
          </div>
          <div className="card-option">
            <div className="card-txt">
              {t('已领取MAX收益')}:{fromWei(minerInfo?.releaseValueDebt)}  
            </div>
            <div className="card-txt card-txt-right">
              {t('已领取CA')}:{fromWei(minerInfo?.releaseCaAmount)} 
            </div>
          </div>
          <div className="card-option">
            <div className="card-txt">
              {t('累计MAX收益')}:{fromWei(minerInfo?.totalMaxValue)}  
            </div>
            <div className="card-txt card-txt-right">
              {t('累计领取')}CA:{fromWei(minerInfo?.totalReleaseCaAmount)}
            </div>
          </div>
          <div className="card-end-box">
            <div className="left-option">
              <div className="left-top-option">{t('待领取收益')} </div>
              <div className="left-bottom-option">{fromWei(pending)}</div>
            </div>
            <div className="right-option" onClick={getClaim}>
              {buttonLoading ? <Spin /> : t("领取")}
            </div>
          </div>
        </div>

        <div className="card-txt-box">
          {t('爆块矿机')}
        </div>

        <div className="rank-tab">
          {tabArray.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => tabIndexChange(index)}
                className={`tab-item ${tabIndex == item.id ? "active" : ""}`}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        {list.length == 0 ? <NoData /> : <Item />}
      </div>
    </div>
  );
};

export default MiningMachine;
