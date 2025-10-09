import "./index.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@/components/Menu";
import menu from "@/assets/img/menu.png";
import logo from "@/assets/img/head-logo.png";
import wallet from "@/assets/img/wallet.png";
import { userAddress } from "@/Store/Store.ts";
const Header: React.FC<{
  showLogo?: boolean;
  title?: string;
  showConnect?: boolean;
  recordText?: string;
  recordUrl?: string;
}> = ({ showLogo, title, showConnect = false, recordText, recordUrl }) => {
  const walletAddress = userAddress().address;
  //格式化地址 0x0e8…dE396
  const address = walletAddress
    ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
    : "";
  console.log("wallet", walletAddress);
  const navigate = useNavigate();
  const [menuStatus, setMenuStatus] = useState<boolean>(false);
  return (
    <>
      <div className={`head-box ${showConnect || "sticky"}`}>
        <div className="menu-box">
          <img
            onClick={() => setMenuStatus(true)}
            className="menu-img"
            src={menu}
            alt=""
          />
          {showLogo && <img className="logo-img" src={logo} alt="" />}
        </div>
        <div className="title-text">{title}</div>

        {showConnect ? (
          <div className="wallet-box">
            <img className="wallet-img" src={wallet} alt="" />
            <span>{address}</span>
          </div>
        ) : (
          <div
            onClick={() => recordUrl && navigate(recordUrl)}
            className="record-text"
          >
            {recordText}
          </div>
        )}
      </div>
      <Menu visible={menuStatus} onClose={() => setMenuStatus(false)} />
    </>
  );
};

export default Header;
