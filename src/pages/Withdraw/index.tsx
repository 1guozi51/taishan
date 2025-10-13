import "./index.scss";
import { useState, useEffect } from "react";
import { Input, Button } from "antd-mobile";
import BackHeader from "@/components/BackHeader";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { ethers } from "ethers";
import { Spin } from "antd";
import { t } from "i18next";

import {
  Totast,
  concatSign,
  fromWei,
  toBigNumberUnits,
  toWei,
} from "@/Hooks/Utils.ts";
import { UseSignMessage } from "@/Hooks/UseSignMessage.ts";
import type { UserInfo } from "@/types/user";
import {
  defaultUserInfo,
  fillNullWithDefault,
} from "@/components/Menu/type.ts";

 

const Withdraw: React.FC = () => {
  const { signMessage } = UseSignMessage();
  //钱包地址
  const walletAddress = userAddress().address;
  //当前是typeindex 1 为usdt 2为ca
  const [typeIndex, setTabIndex] = useState<number>(1);

  //用户信息
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);

  //提现数量
  const [inputAmout, setInputAmout] = useState<number>(0);

  //按钮是否加载中
  const [btnLoading, setBtnLoading] = useState(true);

  const typeTabClick = (val) => {
    setTabIndex(val);
  };

  const inputAmountChange = (val) => {
    console.log("vall===", val);
    setInputAmout(val);
  };
  //获取用户信息
  const getPageData = async () => {
    await NetworkRequest({
      Url: "user/info",
      Data: { address: walletAddress },
    }).then((res) => {
      if (res.data.code == 200) {
        setUserInfo(
          fillNullWithDefault<UserInfo>(res.data.data, defaultUserInfo)
        );
      }
    });
  };

  //确认提现
  const withdrawClick = async () => {
    if (!btnLoading) {
      return;
    }
    //先判断是否小于当前可余额
    let userAmount = typeIndex == 1 ? userInfo.usdtBalance : userInfo.caBalance;

    const a = ethers.BigNumber.from(toWei(inputAmout, 18).toString());
    const b = ethers.BigNumber.from(userAmount);
    if (a.gt(b)) {
      return Totast(t("提现数量输入有误"), "warning");
    }
    if (inputAmout < 1) {
      return Totast(t("1起提"), "warning");
    }
    setBtnLoading(false);
    //获取签名钱包
    const bigRes = concatSign(inputAmout);
    const sigResult = await signMessage(bigRes);
    if (sigResult) {
      await NetworkRequest({
        Url: "userRecord/withdrawApply",
        Method: "post",
        Data: {
          address: walletAddress,
          type: typeIndex,
          amount: toWei(inputAmout, 18).toString(),
          msg: bigRes,
          signature: sigResult,
        },
      })
        .then((res) => {
          console.log("res==", res);
          setBtnLoading(true);
        })
        .finally(() => {
          setBtnLoading(true);
          setInputAmout(0);
          getPageData();
        });
    } else {
      setBtnLoading(true);
    }
    //发送请求
  };
  useEffect(() => {
    getPageData();
  }, []);
  return (
    <>
      <BackHeader title={t("资产提现")} rightText={t("提现记录")} />

      <div className="withdraw-page">
        <div className="assets-title">{t("资产类型")}</div>
        <div className="type-tab">
          <div
            onClick={() => typeTabClick(1)}
            className={`type-item ${typeIndex == 1 ? "active" : ""}`}
          >
            USDT
          </div>

          <div
            onClick={() => typeTabClick(2)}
            className={`type-item ${typeIndex == 2 ? "active" : ""}`}
          >
            CA
          </div>
        </div>
        <div className="balance-box">
          <span>{t("提现数量")}</span>
          <span>
            {t("账户余额")}：
            {typeIndex == 1
              ? fromWei(userInfo.usdtBalance)
              : fromWei(userInfo.caBalance)}
          </span>
        </div>
        <div className="withdraw-num">
          <Input
            className="withdraw-input"
            value={inputAmout}
            onChange={inputAmountChange}
            type="number"
            placeholder="0.00"
          />
          <div className="unit">{typeIndex == 1 ? "USDT" : "CA"}</div>
        </div>
        {/* <div className="gas-box"> */}
        {/* <div className="key">手续费（0.03%）：</div> */}
        {/* <div className="val">0.00 USDT</div> */}
        {/* </div> */}
        <div className="get-box">
          <div className="key">{t('实际到账')}：</div>
          <div className="val">
            {inputAmout} {typeIndex == 1 ? "USDT" : "CA"}
          </div>
        </div>
        <Button className="confirm-btn withdraw-btn" onClick={withdrawClick}>
          {btnLoading ? t('确认提现') : <Spin />}
        </Button>
      </div>
    </>
  );
};

export default Withdraw;
