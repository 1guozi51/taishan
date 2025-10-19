import "./index.scss";
import { useState, useEffect } from "react";
import { Input, Button,Toast } from "antd-mobile";
import Header from "@/components/Header";

import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import more from "@/assets/img/records-more.png";
import ProgressBar from "./component/ProgressBar/ProgressBar";
import CountDown from "./component/CountDown";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { t } from "i18next"; 
import { BigNumber,ethers } from "ethers";
import { fromWei, formatDate, toWei } from "@/Hooks/Utils";
import { Spin } from "antd";
import ContractSend from "@/Hooks/ContractSend.ts";

import ContractList from "@/Contract/Contract.ts";

import NoData from "@/components/NoData";
const statusList = [
  { text: t("众筹成功"), color: "success", status: 2 },
  { text: t("众筹失败"), color: "error", status: 3 },
  { text: t("预约中"), color: "success", status: 1 },
];

interface crowdItem {
  allocateStatus: number;
  backAmount: number | string;
  compensateAmount: number;
  compensateMiner: number;
  crowdfAmount: BigNumber;
  crowdfNo: number;
  endTime: string;
  id: number;
  partakeAmount: BigNumber;
  partakeNumber: number;
  profitAmount: number | string;
  startTime: string;
  status: number;
}
const Crowd: React.FC = () => {
  //钱包地址
  const wallertAddress = userAddress().address;
  const [caBalance, setCaBalance] = useState<BigNumber>(BigNumber.from(0));
  //往期众筹list
  const [crowdfList, setCrowdfList] = useState<crowdItem[]>([]);
  //往期众筹对象
  const [crowdfInfo, setCrowdfInfo] = useState<crowdItem>({});

  //是否参与false 未参与 true 已参与
  const [isJoin, setIsJoin] = useState<boolean>(false);
  //按钮加载
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const [inputCaAmount, setInputCaAmount] = useState<string>("");
  const progressBarChange = (value: string) => {
    handleInputChange(value);
  };
  //输入框发送改变
  const handleInputChange = (value: string) => {
    // 去掉负号
    if (value.startsWith("-")) {
      value = value.slice(1);
    }

    // 允许输入小数，限制最多 4 位小数
    if (value.includes(".")) {
      const [intPart, decimalPart] = value.split(".");
      value = intPart + "." + decimalPart.slice(0, 4);
    }
    // 只允许数字和小数点
    value = value.replace(/[^\d.]/g, "");
    setInputCaAmount(value);
  };

  //获取往期众筹数据
  const getLastCrowdf = async () => {
    const Result = await NetworkRequest({
      Url: "crowdf/crowdfPage",
      Method: "get",
      current: 1,
      size: 5,
    });
    if (Result.data.code == 200) {
      const records = Result.data.data.records;
      if (records.length > 0) {
        const filteredRecords = records.filter((item, index) => index !== 0);
        setCrowdfList(filteredRecords);
        setCrowdfInfo(records[0]);
      }
    }
  };
  //获取当前期数用户是否参与了
  const getCrowdByMySelfInfo = async () => {
    const Result = await NetworkRequest({
      Url: "userCrowdf/crowdfRecord",
      Method: "get",
      Data: {
        current: 1,
        size: 10,
        address: wallertAddress,
        crowdfNo: crowdfInfo.crowdfNo,
      },
    });
    if (Result.data.code == 200) {
      setIsJoin(Result.data.data.records.length > 0 ?true  : false);
    }
  };
  //按钮的显示文字
  const getButtonText = () => {
    let res = {
      text: "",
      disabled: false,
    };
    if (isJoin) {
      res.text = t("你已经参与");
      res.disabled = true;
      return res;
    } else {
      if (Number(inputCaAmount) >= 100) {
        res.text = t("确认参与");
        res.disabled = false;
        return res;
      } else {
        res.text = t("输入的参与额度不足");
        res.disabled = true;
        return res;
      }
    }
  };
  //获取ca余额
  const getCaBalanceOf = async () => {
    const caResult = await ContractRequest({
      tokenName: "CaToken",
      methodsName: "balanceOf",
      params: [wallertAddress],
    });
    if (caResult.value) {
      setCaBalance(caResult.value);
    }
  };

  //参与按钮
  const joinBtnClick = async() => {
    //已参与就直接返回
    if (isJoin) return;
    try {
       setButtonLoading(true);
      //2. 检查授权额度
      const allowanceRes = await ContractRequest({
        tokenName: "CaToken",
        methodsName: "allowance",
        params: [wallertAddress, ContractList["CaPool"].address],
      });
      // 2. 如果额度不足，则发起 approve 授权
      if (allowanceRes.value.lt(toWei(inputCaAmount))) {
        const approveRes = await ContractSend({
          tokenName: "CaToken",
          methodsName: "approve",
          params: [
            ContractList["CaPool"].address,
            ethers.constants.MaxUint256, //授权最大值
          ],
        });
        if (!approveRes || !approveRes.value) {
          Toast(t("Ca授权失败"), "warning");
          setButtonLoading(false);
          return; // 授权失败则中止
        }
      }

      const joinResult = await ContractSend({
        tokenName: "CaPool",
        methodsName: "partakeCrowdf", // 假设兑换方法名为 usdtToCa
        params: [toWei(inputCaAmount)],
      });
      if (joinResult && joinResult.value) {
        setButtonLoading(false);
        // 兑换成功后，刷新页面数据，例如用户余额
        getLastCrowdf(); //获取往期众筹数据
        getCaBalanceOf(); //获取钱包的余额
        setInputCaAmount("");
      } else {
        setButtonLoading(false);
        Toast(t("兑换失败"), "warning");
      }
    } catch (error) {
      Toast(t("交易出错"), "warning");
    }
  };
  useEffect(() => {
    //通过当前众筹信息来判断是否已参与
      if(crowdfInfo.crowdfNo){
        getCrowdByMySelfInfo();
      }
  }, [crowdfInfo]);
  useEffect(() => {
    getButtonText();
  }, [inputCaAmount]);
  useEffect(() => {
    getLastCrowdf(); //获取往期众筹数据
    getCaBalanceOf(); //获取钱包的余额
  }, []);
  return (
    <>
      <Header
        title={t("众筹")}
        recordText={t("我的众筹")}
        recordUrl="/myCrowd"
      />
      <div className="crowd-page">
        <div className="djs-box">
          <div className="now-period">
            {t("第")}
            {crowdfInfo.crowdfNo}
            {t("期预约倒计时")}
          </div>
          <CountDown crowdInfo={crowdfInfo} />
          <div className="join-peo">
            {t("已有")}
            {crowdfInfo.partakeNumber}
            {t("人参与")}
          </div>
        </div>
        <div className="assets-pool">
          <div className="assets-option">
            <span className="key">{t("预约资金池")}</span>
            <span className="val">{fromWei(crowdfInfo.crowdfAmount)}CA</span>
          </div>
          <div className="assets-option">
            <span className="key">{t("参与资金池")}</span>
            <span className="val">{fromWei(crowdfInfo.crowdfAmount)} CA</span>
          </div>
        </div>
        <div className="quota-box">
          <div className="balance-box">
            <span className="title">{t("预约额度")}</span>
            <div className="balances">
              <span>
                {t("余额")}:{fromWei(caBalance)}
              </span>
            </div>
          </div>
          <div className="join-input">
            <Input
              className="input"
              type="number"
              // disabled={getButtonText().disabled}
              value={inputCaAmount}
              onChange={handleInputChange}
              placeholder={t("输入参与最大额度(100起)")}
            />
            <span className="unit">CA</span>
          </div>
          <div className="progressBar-box">
            <ProgressBar
              disabled={getButtonText().disabled}
              inputValue={inputCaAmount}
              totalAmount={caBalance}
              onChange={(value) => progressBarChange(value)}
            />
          </div>
          <Button
            className="confirm-btn join-btn"
            onClick={() => joinBtnClick()}
            disabled={getButtonText().disabled}
          >
             {buttonLoading ? <Spin /> : getButtonText().text}
          </Button>
          <div className="tip-text">
            *{t("实际参与成功金额将于倒计时结束后显示")}
          </div>
        </div>

        <div className="pre-title">
          <span className="text1">{t("往期众筹")}</span>
          <span className="text2">{t("仅展示近四期数据")}</span>
        </div>
        {crowdfList.length == 0 ? (
          <NoData />
        ) : (
          crowdfList.map((crowd, index) => {
            const status = statusList.find(
              (item) => item.status === crowd.status
            );

            return (
              <div className={`crowd-data ${status?.color || ""}`} key={index}>
                <div className="period-num">
                  {t("第")}
                  {crowd.crowdfNo}
                  {t("期")}
                </div>
                <div className="crowd-status">
                  <div className={`status ${status?.color || ""}`}>
                    {t(status?.text)}
                  </div>
                  <div className="time">
                    {formatDate(crowd.startTime).dateTime}
                  </div>
                </div>
                <div className="data-row">
                  <div>
                    <div className="key">{t("总预约额")}</div>
                    <div className="val">{fromWei(crowd.crowdfAmount)} CA</div>
                  </div>
                  <div>
                    <div className="key">{t("我的参与额")}</div>
                    <div className="val">{fromWei(crowd.partakeAmount)} CA</div>
                  </div>
                </div>
                {status?.status != 1 && (
                  <div className="data-row">
                    <div>
                      <div className="key">{t("赎回本金")}</div>
                      <div className="val">{fromWei(crowd.backAmount)} CA</div>
                    </div>
                    <div>
                      <div className="key">{t("收益总额")}</div>
                      <div className="val">
                        {fromWei(crowd.profitAmount)} CA
                      </div>
                    </div>
                  </div>
                )}
                {Number(fromWei(crowd.compensateAmount)) > 0 && (
                  <div className="recoup-box">
                    <div>
                      <div className="key">{t("本金总补偿")}</div>
                      <div className="val">
                        {fromWei(crowd.compensateAmount)} CA
                      </div>
                    </div>
                    <div className="recoup-right-box">
                      <div className="key">{t("赠送矿机总价值")}</div>
                      <div className="val">
                        ={fromWei(crowd.compensateMiner)} CA
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        <div className="crowd-rule">
          <div className="title">{t("众筹规则")}</div>
          <div className="rule-text">1.{t("参与金额100CA起,最大20000CA")}</div>
          <div className="rule-text">2.{t("第一期只有10%的金额参与众筹")}</div>
          <div className="rule-text">
            3.{t("未参与成功的代币金额将退回到预约资金池")}
          </div>
          <div className="rule-text">
            4.{t("众筹成功,参与者将获得10%的静态收益")}
          </div>
          <div className="rule-text">
            5.{t("众筹失败,请")}
            <span className="link">{t("查看详细规则")}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Crowd;
