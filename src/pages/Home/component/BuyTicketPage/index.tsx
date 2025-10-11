import "./index.scss";
import { userAddress } from "@/Store/Store.ts";
import { useEffect, useState } from "react";
import { Input, Spin, Modal, Button } from "antd";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { BigNumber, ethers } from "ethers";
import { Totast } from "@/Hooks/Utils.ts";
import ContractList from "@/Contract/Contract.ts";
import ContractSend from "@/Hooks/ContractSend.ts";
import Dice from "@/components/Dice";
import { use } from "i18next";

interface BuyTicketPageClass {
  onClose: () => void;
}

interface UserInfo {
  inviter: string;
  layerDirectCount: BigNumber;
  directCount: BigNumber;
  preAmount: BigNumber;
  gasAmount: BigNumber;
  ticketNumber: BigNumber;
}

function BuyTicketPage(Props: BuyTicketPageClass) {
  const inviteStorage = localStorage.getItem("invite") || "";
  // 当前钱包地址
  const wallertAddress = userAddress().address;
  // 用户余额
  const [userBalance, setUserBalance] = useState<string>("0");
  // 用户信息
  const [userInfo, setUserInfo] = useState<UserInfo>({});

  // 是否可以购买样式
  const [canBuy, setCanBuy] = useState<boolean>(false);
  // 按钮加载
  const [butLoding, setButLoding] = useState(false);

  const [running, setRunning] = useState(false);

  const [target, setTarget] = useState<number | null>(null);
  const [showDice, setShowDice] = useState<boolean>(false);
  //获取输入的购买数量
  const [buyNumber, setBuyNumber] = useState<string>("");

  // 是否显示绑定邀请人弹出层
  const [showBindFloat, setShowBindFloat] = useState(false);
  // 绑定按钮加载
  const [butLoading, setLoading] = useState(false);
  //邀请人地址
  const [inputAddress, setInputAddress] = useState<string>("");
  /*---------------------上方法，下变量-----------------------------*/
  const [hintTxt, setHintTxt] = useState<string>("0.00 CA≈0.00 USDT");
  // 获取用户余额和节点余额
  const getPageInfo = async () => {
    setButLoding(true);
    const ChainResult = await Promise.allSettled([
      ContractRequest({
        tokenName: "USDTToken",
        methodsName: "balanceOf",
        params: [wallertAddress],
      }),
      ContractRequest({
        tokenName: "CaPool",
        methodsName: "userInfo",
        params: [wallertAddress],
      }),
    ]);

    const UserBalance =
      ChainResult[0].status === "fulfilled"
        ? ChainResult[0].value.value
          ? ethers.utils.formatUnits(ChainResult[0].value.value)
          : "0"
        : "0";
    const userInfoResult = ChainResult[1].status === "fulfilled" ? true : false;
    const userInfoValue = ChainResult[1].value.value;
    setUserBalance(UserBalance);
    if (userInfoResult) {
      console.log("userInfoValue", userInfoValue);
      setUserInfo(userInfoValue);
    }
    if (userInfo.inviter === ethers.constants.AddressZero && inviteStorage) {
      setInputAddress(inviteStorage)
    }
    setButLoding(false);
  };
  //关闭绑定邀请人弹窗
  const closeBindFloat = () => {
    setShowBindFloat(false);
  };

  // 确定购买门票
  const confirmButAction = async () => {
    if (!canBuy) {
      return;
    }
    if (
      userInfo.inviter == ethers.constants.AddressZero &&
      !ethers.utils.isAddress(inputAddress)
    ) {
      Totast("邀请人地址不正确", "warning"); // 邀请人地址不正确
      return;
    }
    if (userInfo.inviter != ethers.constants.AddressZero) {
      if (userInfo.gasAmount.gt(BigNumber.from(0))) {
        //不可以购买
        Totast("您当前持有GAS,无法购买门票", "warning"); // 您当前持有GAS，无法购买门票
        return;
      }
      if (userInfo.ticketNumber.lt(BigNumber.from(1))) {
        Totast("您无法购买门票", "warning"); // 您当前持有GAS，无法购买门票
        return;
      }
    }
    if (parseFloat(userBalance) < parseFloat(buyNumber)) {
      Totast("USDT余额不足", "warning"); // USDT余额不足
      return;
    }
    setButLoding(true);
    let applyAmount = "0";
    let isApply = false;
    await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "allowance",
      params: [wallertAddress, ContractList["CaPool"].address],
    }).then((res) => {
      if (res.value) {
        applyAmount = ethers.utils.formatUnits(res.value);
      }
    });
    if (parseFloat(applyAmount) < parseFloat(buyNumber)) {
      await ContractSend({
        tokenName: "USDTToken",
        methodsName: "approve",
        params: [
          ContractList["CaPool"].address,
          ethers.utils.parseUnits(buyNumber.toString()),
        ],
      }).then((res) => {
        if (res.value) {
          isApply = true;
        } else {
          Totast("授权失败，请检查网络连接", "error"); // 授权失败，请检查网络连接
          return;
        }
      });
    } else {
      isApply = true;
    }
    if (!isApply) {
      Totast("检查授权或者授权时发生了错误，请检查网络后重新尝试", "error"); // 检查授权或者授权时发生了错误，请检查网络后重新尝试
      return;
    }

    try {
      // 使用 await 获取 ContractSend 的返回结果并明确处理成功/失败情况
      const res = await ContractSend({
        tokenName: "CaPool",
        methodsName: "ticket",
        params: [
          ethers.utils.parseUnits(buyNumber.toString()),
          userInfo.inviter === "0x0000000000000000000000000000000000000000"
            ? inputAddress
            : userInfo.inviter,
        ],
      });
      // 在调用后显示骰子并设置运行状态
      setShowDice(true);
      setRunning(true);
      // ContractSend 可能会 resolve 一个结果对象而不是抛出错误，需检查返回值字段
      if (res && res.value) {
        setTarget(res.value);
        // 成功——等待一段时间再停止动画并显示指定点数
        setTimeout(() => {
          setRunning(false);
          setShowDice(false);
          Props.onClose();
        }, 1500);
        Totast("购买成功", "success");
      } else {
        // 交易返回了非成功的结果（例如 res.value === false）
        Totast("购买失败，交易未成功", "error");
        setShowDice(false);
      }
    } catch (error) {
      // 捕获真正的异常/拒绝（例如网络/链上错误）
      Totast("购买失败，发生异常", "error");
      setShowDice(false);
    } finally {
      // 无论成功或失败，都需要关闭加载状态
      setButLoding(false);
    }
  };
  // 绑定按钮执行
  const bindInviteAction = async () => {
    if (!inputAddress) {
      Totast("请输入邀请人地址", "warning"); // 请输入邀请人地址
      return;
    }
    //判断地址是否正确
    if (!ethers.utils.isAddress(inputAddress)) {
      Totast("邀请人地址不正确", "warning"); // 邀请人地址不正确
      return;
    }
    setShowBindFloat(false);
  };
  //打开绑定人弹窗
  const openInviteModal = () => {
    setShowBindFloat(true);
  };
  const BuyInputChange = (e: any) => {
    setBuyNumber(e.target.value);
  };
  //    useEffect(() => {
  //       const t = setTimeout(() => {
  //         setTarget(3);
  //         setRunning(false);
  //       }, 3000);
  //       return () => clearTimeout(t);
  //     }, []);
  useEffect(() => {
    getPageInfo();
  }, []);
  useEffect(() => {
    if (buyNumber == 0) {
      setHintTxt(`0.00CA≈0.00USDT`);
      return;
    }
    ContractRequest({
      tokenName: "CaPool",
      methodsName: "getUsdtToCaAmount",
      params: [ethers.utils.parseEther(buyNumber.toString())],
    }).then((res) => {
      if (res.value) {
        const caAmount = ethers.utils.formatUnits(res.value);
        const usdtAmount = buyNumber || "0";
        setHintTxt(`${usdtAmount} USDT ≈${caAmount} CA`);
      }
    });
  }, [buyNumber]);
  // removed redundant effect that set state to itself
  useEffect(() => {
    //判断是否在10-3000之间
    if (buyNumber === "") {
      setCanBuy(false);
      return;
    }
    if (parseFloat(buyNumber) < 10 || parseFloat(buyNumber) > 3000) {
      setCanBuy(false);
    } else {
      setCanBuy(true);
    }
  }, [buyNumber]);
  const handleRoll = (value: number) => {};
  return (
    <div className="buyNodePage">
      <div className="titleAndClose">
        <div className="title">购买门票</div>
        {/*私募节点*/}
        <div
          className="close"
          onClick={() => {
            Props.onClose();
          }}
        ></div>
      </div>
      <div className="option-box">
        <div className="option-header-top">
          <div className="txt">购买数量</div>
          <div className="txt">账户余额： {userBalance}</div>
        </div>
        <div className="option-input-end">
          <Input
            type="number"
            placeholder="输入买入数量（10-3000）"
            className="input-class"
            value={buyNumber}
            onChange={(e) => {
              BuyInputChange(e);
            }}
          />
          <div className="unit">
            <div className="uni">USDT</div>
          </div>
        </div>
      </div>
      <div className="option-box"></div>
      {userInfo.inviter == "0x0000000000000000000000000000000000000000" ? (
        <div className="option-box">
          <div className="option-header-top">
            <div className="txt">上级地址</div>
          </div>
          <div className="option-input-end">
            <Input
              placeholder="请输入上级地址"
              value={inputAddress}
              className="input-class"
              onChange={(e) => setInputAddress(e.target.value)}
            />
          </div>
        </div>
      ) : null}

      <div className="option-box">
        <div className="option-header-top">
          <div className="txt">获得矿机价值</div>
        </div>
        <div className="option-input-end">
          <Input
            type="text"
            disabled
            placeholder={hintTxt}
            className="input-class"
          />
        </div>
      </div>
      <div className="option-box">
        <div className="option-header-top">
          <div className="txt">预计可获得2至6倍GAS</div>
        </div>
      </div>
      <div
        className="btn-option"
        style={{ background: canBuy ? "#1890ff" : "gray" }}
      >
        {butLoding ? (
          <Spin />
        ) : (
          <div
            className="but"
            onClick={() => {
              confirmButAction();
            }}
          >
            {canBuy ? "确认购买" : "购买数量不符合要求"}
          </div>
        )}
      </div>
      {showDice && (
        <div className="dice-overlay">
          <Dice
            size={80}
            onRoll={handleRoll}
            running={running}
            target={target}
            disabled={true}
          />
        </div>
      )}
    </div>
  );
}

export default BuyTicketPage;
