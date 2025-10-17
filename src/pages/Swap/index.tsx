import "./index.scss";
import { useEffect, useState } from "react";
import { userAddress } from "@/Store/Store.ts";
import { Input, Button, Toast } from "antd-mobile";
import Header from "@/components/Header";
import tip from "@/assets/img/swap-tip.png";
import ca from "@/assets/img/ca.png";
import usdt from "@/assets/img/usdt.png";
import toggle from "@/assets/img/toggle.png";
import more from "@/assets/img/records-more.png";
import { ethers, BigNumber } from "ethers";
import { Totast } from "@/Hooks/Utils.ts";
import { fromWei, toWei } from "@/Hooks/Utils";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import ContractList from "@/Contract/Contract.ts";
import ContractSend from "@/Hooks/ContractSend.ts";
import { ensureWalletConnected } from "@/Hooks/WalletHooks.ts";
import { Spin } from "antd";
import { t } from "i18next";
import type { UserInfoAbi } from "@/types/user";

 

interface SwapFee {
  buyFee: BigNumber;
  sellFee: BigNumber;
}

const Swap: React.FC = () => {
  const wallertAddress = userAddress().address;
  useEffect(() => {
    if (!wallertAddress) {
      ensureWalletConnected();
    } else {
      getPageInfo();
    }
  }, [wallertAddress]);

  // 按钮加载
  const [buttonLoading, setButtonLoading] = useState(false);

  // 兑换比例
  const [ratios, setRatios] = useState<BigNumber>(BigNumber.from(0));

  //usdt 余额
  const [usdTokenBalance, setUsdTokenBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  //ca 余额
  const [caTokenBalance, setCaTokenBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );

  //输入需要换的数量
  const [inputSwapAmount, setInputSwapAmount] = useState<string>("0");
  //输出获得的数量
  const [outputSwapAmount, setOutputSwapAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );

  //ca和usdt 滑点
  const [feeObj, setFeeObj] = useState<SwapFee>({
    buyFee: BigNumber.from(0), //usdt to ca
    sellFee: BigNumber.from(0), //ca to usdt
  });
  //当前兑换类型 1代表ca兑换usdt 2usdt兑换ca
  const [swapType, setSwapType] = useState<number>(2);
  const [swapNumList, setSwapNumList] = useState([
    {
      label: "25%",
      value: 250,
      status: false,
    },
    {
      label: "50%",
      value: 500,
      status: false,
    },
    {
      label: "75%",
      value: 750,
      status: false,
    },
    {
      label: "MAX",
      value: 1000,
      status: false,
    },
  ]);

  // 用户信息
  const [userInfo, setUserInfo] = useState<UserInfoAbi>({});
  //swap切换
  const swapTypeChange = () => {
    setInputSwapAmount("0");
    setOutputSwapAmount(BigNumber.from(0));
    clearCheckStatus();
    swapType == 1 ? setSwapType(2) : setSwapType(1);
  };

  //获取用户USDT和CA余额
  const getPageInfo = async () => {
    const balanceResult = await Promise.allSettled([
      ContractRequest({
        tokenName: "USDTToken",
        methodsName: "balanceOf",
        params: [wallertAddress],
      }),
      ContractRequest({
        tokenName: "CaToken",
        methodsName: "balanceOf",
        params: [wallertAddress],
      }),
      ContractRequest({
        tokenName: "CaPool",
        methodsName: "userInfo",
        params: [wallertAddress],
      }),
      ContractRequest({
        tokenName: "CaPool",
        methodsName: "buyFee",
        params: [],
      }),
      ContractRequest({
        tokenName: "CaPool",
        methodsName: "sellFee",
        params: [],
      }),
      ContractRequest({
        tokenName: "CaPool",
        methodsName: "getUsdtToCaAmount",
        params: [toWei(1)],
      }),
      ContractRequest({
        tokenName: "CaPool",
        methodsName: "getUsdtToCaAmount",
        params: [toWei(1)],
      }),
    ]);

    setRatios(balanceResult[6].value?.value);

    if (
      balanceResult[0].status === "fulfilled" &&
      balanceResult[0].value?.value
    ) {
      setUsdTokenBalance(balanceResult[0].value.value);
    }
    if (
      balanceResult[1].status === "fulfilled" &&
      balanceResult[1].value?.value
    ) {
      setCaTokenBalance(balanceResult[1].value.value);
    }

    if (
      balanceResult[2].status === "fulfilled" &&
      balanceResult[2].value?.value
    ) {
      const userInfoValue = balanceResult[2].value.value;
      setUserInfo(userInfoValue);
    } else {
      setUserInfo({} as UserInfoAbi);
    }

    setFeeObj((prevState) => ({
      ...prevState,
      buyFee: balanceResult[3].value?.value, // 更新 buyFee
      sellFee: balanceResult[4].value?.value, // 更新 sellFee
    }));
    return;
  };

  const clearCheckStatus = () => {
    setSwapNumList((prevList) =>
      prevList.map((item) => ({
        ...item, // 保留其他字段
        status: false, // 更新 status 为 false
      }))
    );
  };
  const swapRateChange = (index) => {
    clearCheckStatus();
    setSwapNumList((prevList) =>
      prevList.map((item, i) => ({
        ...item,
        status: i === index ? true : item.status, // 如果是目标下标，status 设置为 true，否则保持原值
      }))
    );
    const rateItem = swapNumList[index];
    let inputAmount: BigNumber = BigNumber.from(0); // 默认值是 0
    if (swapType == 1) {
      inputAmount = inputAmount = caTokenBalance.mul(rateItem.value).div(1000);
    } else {
      inputAmount = usdTokenBalance.mul(rateItem.value).div(1000);
    }
    swapInputChange(fromWei(inputAmount));
  };

  const swapInputChange = async (amount) => {
    setInputSwapAmount(amount);
    if (amount == null || amount <= 0) {
      setOutputSwapAmount(BigNumber.from(0));
      return;
    }

    if (swapType == 1) {
      //ca to usdt
      const usdtValue = await ContractRequest({
        tokenName: "CaPool",
        methodsName: "getCaToUsdtAmount",
        params: [toWei(amount)],
      });

      setOutputSwapAmount(usdtValue.value);
    } else {
      //usdt to ca
      const caValue = await ContractRequest({
        tokenName: "CaPool",
        methodsName: "getUsdtToCaAmount",
        params: [toWei(amount)],
      });
      setOutputSwapAmount(caValue.value);
    }
  };
  const estimateAmount = (amount: BigNumber) => {
    let result: BigNumber;

    if (swapType === 1) {
      // ca to usdt
      result = amount.sub(amount.mul(feeObj.sellFee).div(10000));
    } else {
      // usdt to ca
      result = amount.sub(amount.mul(feeObj.buyFee).div(10000));
    }
    return fromWei(result);
  };

  //开始兑换
  const confirmBtnClick = async () => {
    if (buttonLoading == true) {
      return;
    }
    setButtonLoading(true);
    let path: string[] = [];
    if (swapType === 1) {
      path = [
        ContractList["CaToken"].address,
        ContractList["USDTToken"].address,
      ];
      try {
        //2. 检查授权额度
        const allowanceRes = await ContractRequest({
          tokenName: "CaToken",
          methodsName: "allowance",
          params: [wallertAddress, ContractList["CaPool"].address],
        });
        // 2. 如果额度不足，则发起 approve 授权

        if (allowanceRes.value.lt(toWei(inputSwapAmount))) {
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
      } catch (error) {
        setButtonLoading(false);
        Toast(t("交易出错"), "warning");
      }
    } else {
      // usdt to ca
      path = [
        ContractList["USDTToken"].address,
        ContractList["CaToken"].address,
      ];

      //判断我的gasAmount 是否<输入值
      if (userInfo.gasAmount.lt(toWei(inputSwapAmount))) {
        //弹窗提示
        setButtonLoading(false);
        Totast(t("GAS余额不足"), "warning"); // 邀请人地址不正确
        return;
      }

      // 1. 检查授权额度
      const allowanceRes = await ContractRequest({
        tokenName: "USDTToken",
        methodsName: "allowance",
        params: [wallertAddress, ContractList["CaPool"].address],
      });

      // 2. 如果额度不足，则发起 approve 授权
      if (allowanceRes.value.lt(toWei(inputSwapAmount))) {
        const approveRes = await ContractSend({
          tokenName: "USDTToken",
          methodsName: "approve",
          params: [
            ContractList["CaPool"].address,
            ethers.constants.MaxUint256, // 授权足额
          ],
        });
        if (!approveRes || !approveRes.value) {
          Toast(t("USDT授权失败"), "warning");
          setButtonLoading(false);
          return; // 授权失败则中止
        }
      }
    }
    const swapRes = await ContractSend({
      tokenName: "CaPool",
      methodsName: "swap", // 假设兑换方法名为 usdtToCa
      params: [toWei(inputSwapAmount), path],
    });
          console.log("swapRes---",swapRes)

    if (swapRes && swapRes.value) {
      setButtonLoading(false);
      // 兑换成功后，刷新页面数据，例如用户余额
      getPageInfo();
      setInputSwapAmount("0");
      clearCheckStatus();
    } else {
      setButtonLoading(false);
      Toast(t("兑换失败"), "warning");
    }
  };

  return (
    <>
      <Header title="Swap" recordText={t("兑换记录")} />
      {wallertAddress ? (
        <div className="swap-page">
          <div className="scale-tip">
            <img src={tip} className="tip-img" alt="" />
            <span>
              {t("兑换比例")}：1 USDT ≈ {fromWei(ratios)} CA
            </span>
          </div>
          <div className="select-assets">{t("选择资产")}</div>

          <div className="from-box">
            <div className="token-info">
              <div className="symbol-box">
                <img src={swapType == 1 ? ca : usdt} alt="" />
                <span>{swapType == 1 ? "CA" : "USDT"}</span>
              </div>
              <div className="balance">
                {t("余额")}：
                {swapType == 1
                  ? fromWei(caTokenBalance)
                  : fromWei(usdTokenBalance)}
              </div>
            </div>
            <Input
              className="from-input"
              value={inputSwapAmount}
              type="number"
              onChange={swapInputChange}
            />
            <div className="scale-list">
              {swapNumList.map((item, index) => (
                <div
                  key={item.value}
                  className={`scale-item ${item.status ? "active" : ""}`}
                  onClick={() => {
                    swapRateChange(index);
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <img
            src={toggle}
            onClick={swapTypeChange}
            className="toggle-img"
            alt=""
          />
          <div className="to-box">
            <div className="token-info">
              <div className="symbol-box">
                <img src={swapType == 1 ? usdt : ca} alt="" />
                <span>{swapType == 1 ? "USDT" : "CA"}</span>
              </div>
              <div className="balance">
                {t("余额")}：
                {swapType == 1
                  ? fromWei(usdTokenBalance)
                  : fromWei(caTokenBalance)}
              </div>
            </div>
            <div className="get-amount">{fromWei(outputSwapAmount)}</div>
          </div>
          <div className="swap-data">
            <span className="key">{t("兑换滑点")}</span>
            <span className="val">
              {swapType == 1
                ? feeObj.sellFee.div(100).toString()
                : feeObj.buyFee.div(100).toString()}
              %
            </span>
          </div>
          <div className="swap-data">
            <span className="key">{t("预计获得")}：</span>
            <span className="val">
              {estimateAmount(outputSwapAmount)}
              {swapType == 2 ? " CA" : " USDT"}
            </span>
          </div>
          {swapType == 1 ? null : (
            <div className="swap-data">
              <span className="key">{t("消耗GAS数")}</span>
              <span className="val">{inputSwapAmount} GAS</span>
            </div>
          )}
          <div className="gas-balance">
            <span className="balance">
              {t("最大购买额度")}：{fromWei(userInfo.gasAmount, 18, false)}
            </span>
          </div>

          <Button className="confirm-btn swap-btn" onClick={confirmBtnClick}>
            {buttonLoading ? <Spin /> : t("兑换")}
          </Button>

          <div className="records-title">
            <span className="title-text">{t('兑换记录')}</span>
            <div className="more-box">
              <span>{t('全部记录')}</span>
              <img src={more} alt="" />
            </div>
          </div>
          <div className="records-head">
            <span>{t('时间')}</span>
            <span>{t('交易对')}</span>
            <span>{t('状态')}</span>
          </div>
          {/* {[1, 2, 3, 4, 5, 5].map((_, index) => {
          return (
            <div className="record-item" key={index}>
              <span>04/25/2025 18:25:56</span>
              <span>用 1500 CA兑换 150.56 SUDT</span>
              <span>已完成</span>
            </div>
          );
        })} */}
        </div>
      ) : (
        <div className="loding">
          <Spin />
        </div>
      )}
    </>
  );
};

export default Swap;
