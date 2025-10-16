import "./index.scss";
import { useEffect, useState } from "react";
import { userAddress } from "@/Store/Store.ts";
import { Input, Button, Toast,ProgressCircle } from "antd-mobile";
import Header from "@/components/Header";
import Item from './components/item/index'
import { fromWei, toWei, Totast } from "@/Hooks/Utils";
import { Spin } from "antd";
import { t } from "i18next";
const Swap: React.FC = () => {
  const wallertAddress = userAddress().address;
  return (
    <div className="mining-machine-page">
      <Header title="我的矿机" recordText="领取记录" />
      <div className="content">
        
         <div className="card-txt-box">
             算力矿机 
         </div>
        <div className="card-box">
          <div className="card-option">
            <div className="card-nums">矿机算力：1000</div>
          </div>
          <div className="card-option">
            <div className="card-txt">已领取动静收益:2000.00</div>
            <div className="card-txt">已领取CA:2000.00</div>
          </div>
          <div className="card-option">
            <div className="card-txt">累计动静收益:2000.00</div>
            <div className="card-txt">累计领取:2000.00</div>
          </div>
          <div className="card-end-box">
            <div className="left-option">
              <div className="left-top-option">待领取收益</div>
              <div className="left-bottom-option">12008.56</div>
            </div>
            <div className="right-option">领取</div>
          </div>
        </div>

         <div className="card-txt-box">
             众筹矿机 
         </div>

        <div className="rank-tab">
          <div className="tab-item active">全部</div>
          <div className="tab-item">挖矿中</div>
          <div className="tab-item">已完成</div>
        </div>
        <Item></Item>
      </div>
    </div>
  );
};

export default Swap;
