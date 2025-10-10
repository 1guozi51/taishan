import "./index.scss";
import { useEffect, useState } from "react";
import { userAddress } from "@/Store/Store.ts";
import { Input, Button } from "antd-mobile";
import Header from "@/components/Header";
import tip from "@/assets/img/swap-tip.png";
import ca from "@/assets/img/ca.png";
import usdt from "@/assets/img/usdt.png";
import toggle from "@/assets/img/toggle.png";
import more from "@/assets/img/records-more.png";
import { ethers } from "ethers";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import ContractList from "@/Contract/Contract.ts";
import ContractSend from "@/Hooks/ContractSend.ts";
interface UserInfo {
  inviter: string;
  layerDirectCount: number;
  directCount: number;
  preAmount: bigint;
  gasAmount: bigint;
  ticketNumber: bigint;
}
const Swap: React.FC = () => {
  const wallertAddress = userAddress().address;
  //usdt 余额
  const [usdTokenBalance, setUsdTokenBalance] = useState("0");

  //ca 余额
  const [caTokenBalance, setCaTokenBalance] = useState("0");
  //ca兑换usdt 滑点
  const [sellFee, setSellFee] = useState("0");

  //usdt兑换ca 滑点
  const [buyFee, setBuyFee] = useState("0");

  //当前兑换类型 1代表ca兑换usdt 2usdt兑换ca
  const [swapType, setSwapType] = useState(2);

  const swapNumList = [
    {
      label: "25%",
      value: 0.25,
    },
    {
      label: "50%",
      value: 0.5,
    },
    {
      label: "75%",
      value: 0.75,
    },
    {
      label: "MAX",
      value: 1,
    },
  ];
  //得到的对应值
  const [swapNum, setSwapNum] = useState(0);
  //当前选中的最大兑换百分比
  const [swapPercentage, setSwapPercentage] = useState(0);
  //当前选中的百分比数量
  const [swapComPutersNum, setSwapComPutersNum] = useState(1);
  // 用户信息
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  //swap切换
  const swapTypeChange = () => {
    swapType == 1 ? setSwapType(2) : setSwapType(1);
  };
  //得到ca转usdt的兑换值
  const getCaToUsdtAmount = async () => {
    if (swapComPutersNum < 0) {
      setSwapNum(0);
      return;
    }
    const usdtValue = await ContractRequest({
      tokenName: "CaPool",
      methodsName: "getCaToUsdtAmount",
      params: [ethers.utils.parseEther(swapComPutersNum.toString())],
    });
    console.log("得到ca转usdt的兑换值==", formatAmount(usdtValue.value));
    setSwapNum(formatAmount(usdtValue.value));
  };
  //得到usdt转ca的兑换值
  const getUsdtToCaAmount = async () => {
    if (swapComPutersNum <= 0) {
      setSwapNum(0);
      return;
    }
    const usdtValue = await ContractRequest({
      tokenName: "CaPool",
      methodsName: "getUsdtToCaAmount",
      params: [ethers.utils.parseEther(swapComPutersNum.toString())],
    });
    console.log("得到usdt转ca的兑换值==", formatAmount(usdtValue.value));
    setSwapNum(formatAmount(usdtValue.value));
    getCaNum();
  };
  //得到ca的滑点值
  const getCaSlipPageNum = async () => {
    const caRes = await ContractRequest({
      tokenName: "CaPool",
      methodsName: "sellFee",
      params: [],
    });
    setSellFee(caRes.value / 10000);
  };
  //预计获得的ca值
  const getCaNum = () => {
    //ca-(ca乘以ca的滑点)
    return Number(swapNum - swapNum * sellFee).toFixed(2);
  };
  //预计获得usdt值
  const getUsdtNum = () => {
    //ca-(ca乘以ca的滑点)
    return Number(swapNum - swapNum * buyFee).toFixed(2);
  };
  //得到usdt的滑点值
  const getUsdtSlipPageNum = async () => {
    const usdtRes = await ContractRequest({
      tokenName: "CaPool",
      methodsName: "buyFee",
      params: [],
    });
    setBuyFee(usdtRes.value / 10000);
  };
  //计算百分比数值
  const calculatePercentage = (total, part) => {
    if (total === 0) {
      return 0; // 避免除以零的情况
    }
    return Number(total * part).toFixed(2);
  };

  //计算出对应的百分比数值
  const computersNum = () => {
    //得到当前1 还是2

    setSwapComPutersNum(
      calculatePercentage(
        swapType == 1 ? caTokenBalance : usdTokenBalance,
        swapPercentage
      )
    );
    swapType == 1 ? getCaToUsdtAmount() : getUsdtToCaAmount();
  };

  //获取用户USDT和CA余额
  const getPageInfo = async () => {
    const usdtAndCaBalanceResult = await Promise.allSettled([
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
    ]);

    setUsdTokenBalance(formatAmount(usdtAndCaBalanceResult[0].value.value));

    setCaTokenBalance(formatAmount(usdtAndCaBalanceResult[1].value.value));
    const userInfoValue = usdtAndCaBalanceResult[2].value.value;
    setUserInfo(userInfoValue);
    console.log("usdtAndCaBalanceResult[2].value", userInfo.gasAmount);
  };

  const formatAmount = (amount, decimals = 18) => {
    const formatted = ethers.utils.formatUnits(amount, decimals);
    return parseFloat(formatted).toFixed(2);
  };

  const swapComPutersNumChange = (e) => {
    setSwapComPutersNum(e === "" ? 0 : parseFloat(e));
  };
  //开始兑换
  const confirmBtnClick = async () => {
    swapType == 2 ? usdtToCa() : caToUsdt();
  };
  const caToUsdt = async () => {
    let amount = swapComPutersNum.toString();
    try {
      // 1. 检查授权额度
      const allowanceRes = await ContractRequest({
        tokenName: "CaToken",
        methodsName: "allowance",
        params: [wallertAddress, ContractList["CaPool"].address],
      });
      const allowanceAmount = parseFloat(
        ethers.utils.formatUnits(allowanceRes.value || "0")
      );
       console.log("caToUsdt==allowanceRes=", allowanceRes);
      // 2. 如果额度不足，则发起 approve 授权
      if (allowanceAmount < swapComPutersNum) {
        const approveRes = await ContractSend({
          tokenName: "CaToken",
          methodsName: "approve",
          params: [
            ContractList["CaPool"].address,
             ethers.utils.parseUnits(amount)), // 授权足额
          ],
        });
        if (!approveRes || !approveRes.value) {
          console.error("USDT 授权失败");
          return; // 授权失败则中止
        }
      }
      let amountEnd=ethers.utils.parseUnits(amount.toString())
      console.log('amountEnd===',amountEnd)
      const swapRes = await ContractSend({
        tokenName: "CaPool",
        methodsName: "swap", // 假设兑换方法名为 usdtToCa
        params: [
          amountEnd,
          [
            "0x7e0060dD72eBBc2dbA1A1498905657874c6064d3",
            "0x8873bB4707351279e921637f0700BE5f9cef1b1B",
          ],
        ],
      });
      if (swapRes && swapRes.value) {
        console.log("兑换成功");
        // 兑换成功后，刷新页面数据，例如用户余额
        getPageInfo();
      } else {
        console.error("兑换失败");
      }
    } catch (error) {
      console.error("交易出错:", error);
    }
  };
  const usdtToCa = async () => {
    let amount = swapComPutersNum.toString();
    console.log("usdtToCa==amount=", amount);
    try {
      // 1. 检查授权额度
      const allowanceRes = await ContractRequest({
        tokenName: "USDTToken",
        methodsName: "allowance",
        params: [wallertAddress, ContractList["CaPool"].address],
      });

      const allowanceAmount = parseFloat(
        ethers.utils.formatUnits(allowanceRes.value || "0")
      );

      // 2. 如果额度不足，则发起 approve 授权
      if (allowanceAmount < swapComPutersNum) {
        const approveRes = await ContractSend({
          tokenName: "USDTToken",
          methodsName: "approve",
          params: [
            ContractList["CaPool"].address,
            ethers.utils.parseUnits(amount), // 授权足额
          ],
        });
        if (!approveRes || !approveRes.value) {
          console.error("USDT 授权失败");
          return; // 授权失败则中止
        }
      }
      const swapRes = await ContractSend({
        tokenName: "CaPool",
        methodsName: "swap", // 假设兑换方法名为 usdtToCa
        params: [
          ethers.utils.parseUnits(amount, 18),
          [
            "0x8873bB4707351279e921637f0700BE5f9cef1b1B",
            "0x7e0060dD72eBBc2dbA1A1498905657874c6064d3",
          ],
        ],
      });
      if (swapRes && swapRes.value) {
        console.log("兑换成功");
        // 兑换成功后，刷新页面数据，例如用户余额
        getPageInfo();
      } else {
        console.error("兑换失败");
      }
    } catch (error) {
      console.error("交易出错:", error);
    }
  };
  useEffect(() => {
    //如果类型切换了
    setSwapPercentage(1);
  }, [swapType]);

  useEffect(() => {
    swapType == 1 ? getCaToUsdtAmount() : getUsdtToCaAmount();
  }, [swapComPutersNum]);

  useEffect(() => {
    //如果类型切换了
    getUsdtToCaAmount();
  }, [usdTokenBalance]);

  useEffect(() => {
    //如果类型切换了
    getCaToUsdtAmount();
  }, [caTokenBalance]);
  //如果监听到了swapPercentage值的变化
  useEffect(() => {
    computersNum();
  }, [swapPercentage]);
  //如果swapNum有变化
  useEffect(() => {
    swapType == 1 ? getCaNum() : getUsdtNum();
  }, [swapNum]);
  useEffect(() => {
    getPageInfo();
    getUsdtSlipPageNum();
    getCaSlipPageNum();
  }, []);
  return (
    <>
      <Header title="Swap" recordText="兑换记录" />
      <div className="swap-page">
        <div className="scale-tip">
          <img src={tip} className="tip-img" alt="" />
          <span>兑换比例：1 USDT ≈ 102.56 CA</span>
        </div>
        <div className="select-assets">选择资产</div>
        {/* <div className="assets-tab">
          <div className="assets-tab active">账户资产</div>
          <div className="assets-tab">钱包资产</div>
        </div> */}
        <div className="from-box">
          <div className="token-info">
            <div className="symbol-box">
              <img src={swapType == 1 ? ca : usdt} alt="" />
              <span>{swapType == 1 ? "CA" : "USDT"}</span>
            </div>
            <div className="balance">
              余额：{swapType == 1 ? caTokenBalance : usdTokenBalance}
            </div>
          </div>
          <Input
            className="from-input"
            value={swapComPutersNum}
            type="number"
            onChange={swapComPutersNumChange}
            placeholder="0.00"
          />
          <div className="price-text">
            ≈ {swapNum} {swapType == 1 ? "USDT" : "CA"}
          </div>
          <div className="scale-list">
            {swapNumList.map((item) => (
              <div
                key={item.value}
                className={`scale-item ${
                  swapPercentage === item.value ? "active" : ""
                }`}
                onClick={() => {
                  setSwapPercentage(item.value);
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
              余额：{swapType == 1 ? usdTokenBalance : caTokenBalance}
            </div>
          </div>
          <div className="get-amount">
            {" "}
            {swapType == 2 ? getCaNum() + "CA" : getUsdtNum() + "USDT"}
          </div>
        </div>
        <div className="swap-data">
          <span className="key">兑换滑点</span>
          <span className="val">
            {swapType == 1 ? sellFee * 100 : buyFee * 100}%
          </span>
        </div>
        <div className="swap-data">
          <span className="key">预计获得：</span>
          <span className="val">
            {swapType == 2 ? getCaNum() + "CA" : getUsdtNum() + "USDT"}
          </span>
        </div>
        {swapType == 1 ? null : (
          <div className="swap-data">
            <span className="key">消耗GAS数</span>
            <span className="val">{swapComPutersNum} GAS</span>
          </div>
        )}
        <div className="gas-balance">
          <span className="balance">GAS余额：0</span>
          {/* {ethers.utils.formatUnits( userInfo.gasAmount)} */}
          <span className="go-get">去获取</span>
        </div>
        <Button className="confirm-btn swap-btn" onClick={confirmBtnClick}>
          兑换
        </Button>
        <div className="records-title">
          <span className="title-text">兑换记录</span>
          <div className="more-box">
            <span>全部记录</span>
            <img src={more} alt="" />
          </div>
        </div>
        <div className="records-head">
          <span>时间</span>
          <span>交易对</span>
          <span>状态</span>
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
    </>
  );
};

export default Swap;
