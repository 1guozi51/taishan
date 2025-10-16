import "./index.scss";
import React from "react";
import { Totast } from "@/Hooks/Utils.ts";
import { Popup, Button, Modal, Mask } from "antd-mobile";
import { userAddress } from "@/Store/Store.ts";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import ContractList from "@/Contract/Contract.ts";
import ContractSend from "@/Hooks/ContractSend.ts";

import { fromWei } from "@/Hooks/Utils";
import closeImg from "@/assets/img/closeImg.png";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { BigNumber } from "ethers";
import { ethers } from "ethers";
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
const Home: React.FC<{
  popState: boolean;
  setPopState: () => void;
  setNodeState: () => void;
  selectNodeItem: NodeListClass;
  usdtBalance: BigNumber;
  buySuccessChange: () => void;
}> = ({
  popState,
  setPopState,
  setNodeState,
  selectNodeItem,
  usdtBalance,
  buySuccessChange,
}) => {
  const navigate = useNavigate();

  // 当前钱包地址
  const wallertAddress = userAddress().address;
  // 按钮加载
  const [butLoding, setButLoding] = useState<boolean>(false);

  // 确定购买节点
  const confirmButAction = async () => {
    if (selectNodeItem.balance.eq(0)) {
      Totast(t('节点已售完'), "warning"); // 节点已售完
      return;
    }
    if (usdtBalance.lt(selectNodeItem.price)) {
      Totast(t("USDT余额不足"), "warning"); // USDT余额不足
      return;
    }
    setButLoding(true);
    let applyAmount = BigNumber.from(0);
    let isApply = false;
    await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "allowance",
      params: [wallertAddress, ContractList["idoPool"].address],
    }).then((res) => {
      if (res.value) {
        applyAmount = res.value;
      }else{
         setButLoding(false);
      }
    });
    if (applyAmount.lt(selectNodeItem.price)) {
      await ContractSend({
        tokenName: "USDTToken",
        methodsName: "approve",
        params: [ContractList["idoPool"].address, ethers.constants.MaxUint256],
      }).then((res) => {
        if (res.value) {
          isApply = true;
        } else {
           setButLoding(false);
          // Totast("授权失败,请检查网络连接", "error"); // 授权失败，请检查网络连接
          return;
        }
      });
    } else {
      isApply = true;
    }
    if (!isApply) {
       setButLoding(false);
      Totast("检查授权或者授权时发生了错误,请检查网络后重新尝试", "error"); // 检查授权或者授权时发生了错误，请检查网络后重新尝试
      return;
    }
    await ContractSend({
      tokenName: "idoPool",
      methodsName: "ido",
      params: [selectNodeItem.id],
    }).then((res) => {
      if (res.value) {
        Totast(t("购买成功"), "success"); // 购买成功
        setPopState();
        buySuccessChange(selectNodeItem);
      }
    });
    setButLoding(false);
  };
  return (
    <>
      <Popup
        visible={popState}
        onMaskClick={() => {
          setPopState();
        }}
        onClose={() => {
          setPopState();
        }}
        bodyStyle={{ height: "440px" }}
      >
        <div className="PopBox">
          <div className="popTitle">
            <div>{t("购买节点")}</div>
            <img
              src={closeImg}
              alt=""
              onClick={() => {
                setPopState();
              }}
            />
          </div>
          <div>
            <div className="payNode">
              <img src={selectNodeItem.nodeImg} alt="" />
            </div>
            <div className="price">{fromWei(selectNodeItem.price)} USDT</div>
            <div className="balance">
              {t('钱包余额')}：{fromWei(usdtBalance) || "0"} USDT
            </div>
            <Button
              className="coloursBT"
              style={{ width: "100%", height: "50px" }}
              onClick={() => {
                confirmButAction();
              }}
            >
              {butLoding ? (
                <div className="but">
                  <Spin />
                </div>
              ) : (
                <div className="but">{t('确认购买')}</div>
              )}
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default Home;
