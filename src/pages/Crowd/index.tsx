import "./index.scss";
import { useState } from "react";
import { Input, Button } from "antd-mobile";
import Header from "@/components/Header";
import more from "@/assets/img/records-more.png";
import ProgressBar from "./component/ProgressBar/ProgressBar";
import CountDown from "./component/CountDown";
import { t } from "i18next";
const Crowd: React.FC = () => {
  const [step, setStep] = useState(2);
  return (
    <>
      <Header
        title={t("众筹")}
        recordText={t("我的众筹")}
        recordUrl="/myCrowd"
      />
      <div className="crowd-page">
        <div className="djs-box">
          <div className="now-period">
            {t("第")}180{t("期预约倒计时")}
          </div>
          <CountDown
            targetTime="1760714809000" // 27小时
            onEnd={() => console.log("🎉 倒计时结束")}
          />
          <div className="join-peo">
            {t("已有")}328{t("人参与")}
          </div>
        </div>
        <div className="assets-pool">
          <span className="key">{t("预约资金池")}</span>
          <span className="val">3,280,800.00 CA</span>
        </div>
        <div className="quota-box">
          <div className="balance-box">
            <span className="title">{t("预约额度")}</span>
            <div className="balances">
              <span>{t("账户余额")}:960,000.00</span>
              {/* <img src={more} className="more-img" alt="" /> */}
            </div>
          </div>
          <div className="join-input">
            <Input
              className="input"
              type="number"
              placeholder={t("输入参与最大额度(100起)")}
            />
            <span className="unit">CA</span>
          </div>
          <div className="progressBar-box">
            <ProgressBar currentStep={step} />
          </div>
          <Button className="confirm-btn join-btn">{t("确认参与")}</Button>
          <div className="tip-text">
            *{t("实际参与成功金额将于倒计时结束后显示")}
          </div>
        </div>

        <div className="pre-title">
          <span className="text1">{t("往期众筹")}</span>
          <span className="text2">{t("仅展示近四期数据")}</span>
        </div>
        {[1, 2, 3, 4].map((crowd, index) => {
          const isSuccess = index % 2 == 0;
          return (
            <div
              className={`crowd-data ${isSuccess ? "success" : "error"} `}
              key={index}
            >
              <div className="period-num">
                {t("第")}
                {index + 1}
                {t("期")}
              </div>
              <div className="crowd-status">
                <div className="status">{t("众筹成功")}</div>
                <div className="time">09/05/2025 18:25:56</div>
              </div>
              <div className="data-row">
                <div>
                  <div className="key">{t("总预约额")}</div>
                  <div className="val">100,000.00 CA</div>
                </div>
                <div>
                  <div className="key">{t("总参与额")}</div>
                  <div className="val">10,000.00 CA</div>
                </div>
              </div>
              <div className="data-row">
                <div>
                  <div className="key">{t("总退回本金")}</div>
                  <div className="val">90,000.00 CA</div>
                </div>
                <div>
                  <div className="key">{t("已赎回总额")}</div>
                  <div className="val">8,320.6 CA</div>
                </div>
              </div>
              {!isSuccess && (
                <div className="recoup-box">
                  <div>
                    <div className="key">{t("本金总补偿")}</div>
                    <div className="val">180,679.44 CA</div>
                  </div>
                  <div>
                    <div className="key">{t("赠送矿机总价值")}</div>
                    <div className="val">1,609,000.00 CA</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="crowd-rule">
          <div className="title">{t("众筹规则")}</div>
          <div className="rule-text">1.{t("参与金额100CA起,最大20000CA")}</div>
          <div className="rule-text">2.{t("第一期只有10%的金额参与众筹")}</div>
          <div className="rule-text">
            3.{t("未参与成功的代币金额将退回到预约资金池")}
          </div>
          <div className="rule-text">
            4.{t("众筹成功,参与者将获得10%的静态收益")}
          </div>
          <div className="rule-text">
            5.{t("众筹失败,请")}
            <span className="link">{t("查看详细规则")}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Crowd;
