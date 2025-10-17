import "./index.scss";
import { useState } from "react";
import { Input, Button } from "antd-mobile";
import Header from "@/components/Header";
import more from "@/assets/img/records-more.png";
import ProgressBar from "./component/ProgressBar";

const Crowd: React.FC = () => {
  const [step, setStep] = useState(2);

  return (
    <>
      <Header title="众筹" recordText="我的众筹" recordUrl="/myCrowd"/>
      <div className="crowd-page">
        <div className="djs-box">
          <div className="now-period">第180期预约倒计时</div>
          <div className="djs-list">
            <div className="djs-item">23</div>
            <div>:</div>
            <div className="djs-item">08</div>
            <div>:</div>
            <div className="djs-item">56</div>
          </div>
          <div className="join-peo">已有328人参与</div>
        </div>
        <div className="assets-pool">
          <span className="key">预约资金池</span>
          <span className="val">3,280,800.00 CA</span>
        </div>
        <div className="quota-box">
          <div className="balance-box">
            <span className="title">预约额度</span>
            <div className="balances">
              <span>账户余额：960,000.00</span>
              <img src={more} className="more-img" alt="" />
            </div>
          </div>
          <div className="join-input">
            <Input
              className="input"
              type="number"
              placeholder="输入参与最大额度（100起）"
            />
            <span className="unit">CA</span>
          </div>
          <div className="progressBar-box">
            <ProgressBar currentStep={step} />
          </div>
          <Button className="confirm-btn join-btn">确认参与</Button>
          <div className="tip-text">*实际参与成功金额将于倒计时结束后显示</div>
        </div>

        <div className="pre-title">
          <span className="text1">往期众筹</span>
          <span className="text2">仅展示近四期数据</span>
        </div>
        {[1, 2, 3, 4].map((crowd, index) => {
          const isSuccess = index % 2 == 0;
          return (
            <div
              className={`crowd-data ${isSuccess ? "success" : "error"} `}
              key={index}
            >
              <div className="period-num">第{index + 1}期</div>
              <div className="crowd-status">
                <div className="status">众筹成功</div>
                <div className="time">09/05/2025 18:25:56</div>
              </div>
              <div className="data-row">
                <div>
                  <div className="key">总预约额</div>
                  <div className="val">100,000.00 CA</div>
                </div>
                <div>
                  <div className="key">总参与额</div>
                  <div className="val">10,000.00 CA</div>
                </div>
              </div>
              <div className="data-row">
                <div>
                  <div className="key">总退回本金</div>
                  <div className="val">90,000.00 CA</div>
                </div>
                <div>
                  <div className="key">已赎回总额</div>
                  <div className="val">8,320.6 CA</div>
                </div>
              </div>
              {!isSuccess && (
                <div className="recoup-box">
                  <div>
                    <div className="key">本金总补偿</div>
                    <div className="val">180,679.44 CA</div>
                  </div>
                  <div>
                    <div className="key">赠送矿机总价值</div>
                    <div className="val">1,609,000.00 CA</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="crowd-rule">
          <div className="title">众筹规则</div>
          <div className="rule-text">1.参与金额100CA起，最大20000CA</div>
          <div className="rule-text">2.第一期只有10%的金额参与众筹</div>
          <div className="rule-text">
            3.未参与成功的代币金额将退回到预约资金池
          </div>
          <div className="rule-text">4.众筹成功，参与者将获得10%的静态收益</div>
          <div className="rule-text">
            5.众筹失败，请<span className="link">查看详细规则</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Crowd;
