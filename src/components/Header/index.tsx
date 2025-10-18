import "./index.scss";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@/components/Menu";
import menu from "@/assets/img/menu.png";
import logo from "@/assets/img/head-logo.png";
import wallet from "@/assets/img/wallet.png";
import { userAddress } from "@/Store/Store.ts";
import { formatAddress } from "@/Hooks/Utils";

const Header: React.FC<{
  showLogo?: boolean;
  title?: string;
  showConnect?: boolean;
  recordText?: string;
  recordUrl?: string;
   fixed?: boolean; // 新增属性
}> = ({ showLogo, title, showConnect = false, recordText, recordUrl,fixed = true }) => {
  const walletAddress = userAddress().address;
  const address = formatAddress(walletAddress);
  const navigate = useNavigate();
  const [menuStatus, setMenuStatus] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setScrolled(window.scrollY > headerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {!menuStatus && (
        <div
          ref={headerRef}
           className={`head-box ${scrolled ? "scrolled" : ""} ${fixed ? "fixed" : "static"}`}
        >
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
      )}

      <Menu visible={menuStatus} onClose={() => setMenuStatus(false)} />
    </>
  );
};

export default Header;
