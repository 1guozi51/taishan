import "./index.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Totast } from "@/Hooks/Utils.ts";
import { userAddress } from "@/Store/Store.ts";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import close from "@/assets/img/close.png";
import wallet from "@/assets/img/wallet.png";
import node from "@/assets/img/node-level.png";
import member from "@/assets/img/member-level.png";
import hide from "@/assets/img/hide-assets.png";
import more from "@/assets/img/more.png";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { fromWei } from "@/Hooks/Utils";
import i18n, { t } from "i18next";
interface MenuType {
  label: string;
  url: string;
}
const menuList: MenuType[] = [
  { label:  t('首页'), url: "/" },
  { label: t("门票"), url: "/recordList?type=tickets" },
  { label: t("众筹"), url: "" },
  { label: t("矿机"), url: "" },
  { label: "Swap", url: "/swap" },
  { label: t("节点"), url: "/myNode" },
  { label: t("团队"), url: "/myTeam" },
];

// const menuList: MenuType[] = [
//   { label:  t('首页'), url: "/" },
//   { label: t("门票"), url: "/recordList?type=tickets" },
//   { label: t("众筹"), url: "/crowd" },
//   { label: t("矿机"), url: "" },
//   { label: "Swap", url: "/swap" },
//   { label: t("节点"), url: "/myNode" },
//   { label: t("团队"), url: "/myTeam" },
// ];

const Menu: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [userInfo, setUserInfo] = useState({});
  const [gasNumber, setGasNumber] = useState("");
  const navigate = useNavigate();
  const walletAddress = userAddress().address;
  //格式化地址 0x0e8…dE396
  const address = walletAddress
    ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
    : "";
  //获取用户信息

  // 当前语言
  const [curLang, setCurLang] = useState<number>(1);

  // 设置语言
  const changeLanguage = (name: string) => {
    i18n.changeLanguage(name);
    if (name == "zh") {
      setCurLang(1);
    }
    if (name == "en") {
      setCurLang(2);
    }
    window.localStorage.setItem("lang", name);
    window.location.reload();
  };

  const getUserInfo = async () => {
    const userInfoResult = await Promise.allSettled([
      NetworkRequest({
        Url: "user/info",
        Data: { address: walletAddress },
      }),
      ContractRequest({
        tokenName: "CaPool",
        methodsName: "userInfo",
        params: [walletAddress],
      }),
    ]);
    const userInfoNetWork =
      userInfoResult[0].status === "fulfilled" ? true : false;
    const caPoolUserInfo =
      userInfoResult[1].status === "fulfilled" ? true : false;
    if (userInfoNetWork) {
      setUserInfo(userInfoResult[0].value.data.data);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setGasNumber(userInfoResult[1].value.value.gasAmount);
    }
  };
  const handleClick = (url: string) => {
    if (url) {
      onClose();
      setTimeout(() => {
        navigate(url);
      }, 200);
    } else {
      return Totast(t("敬请期待"), "warning"); // 邀请人地址不正确
    }
  };
  const getNodeLabel = (level) => {
    switch (level) {
      case 1:
        return t('小节点');
      case 2:
        return t("大节点");
      case 3:
        return t("超级节点");
      case 4:
        return t("股东节点");
      default:
        return "";
    }
  };
  // 获取当前语言
  const getCurrLang = () => {
    const localLang: string = window.localStorage.getItem("lang") ?? "zh";
    i18n.changeLanguage(localLang);
    if (localLang == "zh") {
      setCurLang(1);
    }
    if (localLang == "en") {
      setCurLang(2);
    }
  };
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    if (walletAddress) {
      getUserInfo();
      getCurrLang();
    }
  }, [visible]);

  return (
    <>
      <div className={`menu-content ${visible ? "show" : "hide"}`}>
        <div className="connect-info">
          <img onClick={onClose} src={close} className="close-img" alt="" />

          <div className="wallet-box">
            <img src={wallet} className="wallet-img" alt="" />
          </div>
          <div className="address">{address}</div>
          {userInfo.nodeLevel > 0 ? (
            <div className="node-box">
              <img src={node} className="node-img" alt="" />
              <span>{getNodeLabel(userInfo.nodeLevel)}</span>
            </div>
          ) : null}
          {userInfo.userLevel == 0 ? null : (
            <div className="member-box">
              <img src={member} className="member-img" alt="" />
              <span>{userInfo.userLevel}</span>
            </div>
          )}
        </div>

        <div className="connect-info">
            <div className="lang-txt">{t("切换语言")}</div>
          <div className="langAndClose">
            <div className="lang flex flexStart">
              <div
                className={"item " + (curLang == 1 ? "select" : "")}
                onClick={() => {
                  changeLanguage("zh");
                }}
              >
                {t("简体中文")}
              </div>
              <div
                className={"item " + (curLang == 2 ? "select" : "")}
                onClick={() => {
                  changeLanguage("en");
                }}
              >
                English
              </div>
            </div>
          </div>
        </div>

        <div className="menu-info">
          <div className="assets-info">
            <div className="assets-title">
              <span>{t("资产")}</span>
              <img src={hide} className="status-img" alt="" />
            </div>
            <div className="balance-box">
              <div className="balance-item">
                <div className="balance-key">
                  <span>USDT{t("余额")}</span>
                  <img src={more} className="more-img" alt="" />
                </div>
                <div className="balance-val">{userInfo.usdtBalance}</div>
              </div>
              <div className="balance-item">
                <div className="balance-key">
                  <span>CA{t("余额")}</span>
                  <img src={more} className="more-img" alt="" />
                </div>
                <div className="balance-val">{userInfo.caBalance}</div>
              </div>
            </div>
            <div className="btn-list">
              {/* <div onClick={() => navigate('/deposit')} className='btn cz-btn'>
                                充值
                            </div>
                            <div onClick={() => navigate('/withdraw')} className='btn tx-btn'>
                                提现
                            </div> */}
            </div>
          </div>
          <div className="gas-balance">
            <div className="gas">GAS{t("余额")}：{fromWei(gasNumber) || "-"}</div>
            <div>
              <span className="link-text">{t("明细记录")}</span>
              <span className="link-text">{t("获取")}</span>
            </div>
          </div>
          {menuList.map((menu, index) => {
            return (
              <div
                className="menu-item"
                key={index}
                onClick={() => handleClick(menu.url)}
              >
                <span>{menu.label}</span>
                <img src={more} className="more-img" alt="" />
              </div>
            );
          })}

          <div className="disconnect-box">{t("断开绑定钱包")}</div>
        </div>
      </div>
    </>
  );
};

export default Menu;
