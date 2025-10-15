import "./index.scss";
import React from "react";
import { useNavigate } from "react-router-dom";

import back from "@/assets/img/back.png";

const Header: React.FC<{
  title: string;
  rightText?: string;
  rightUrl?: string;
}> = ({ title, rightText, rightUrl }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="back-header">
       <div className="back-left">
         <img
          onClick={() => navigate(-1)}
          src={back}
          className="back-img"
          alt=""
        />
       </div>
        <span className="back-header-title">{title}</span>
        <span
          onClick={() => rightUrl && navigate(rightUrl)}
          className="right-text"
        >
          {rightText}
        </span>
      </div>
    </>
  );
};

export default Header;
