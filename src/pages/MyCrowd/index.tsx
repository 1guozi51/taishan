import "./index.scss";
import { useState } from "react";
import { Input, Button } from "antd-mobile";
import Header from "@/components/Header";
import more from "@/assets/img/records-more.png";
import { ProgressCircle } from "antd-mobile";
import showEyes from "@/assets/img/eyes.png";
import hide from "@/assets/img/hide-assets.png";
import { RightOutline } from "antd-mobile-icons";
import NoData from "@/components/NoData";
import { getMask } from "@/Hooks/Utils";
interface TabItem {
  id: number;
  name: string;
}
const tabArray: TabItem[] = [
  {
    id: 0,
    name: "全部",
  },
  {
    id: 1,
    name: "参与成功",
  },
  {
    id: 2,
    name: "参与失败",
  },
];
const MyCrowd: React.FC = () => {
  //tab下标
  const [tabIndex, setTabIndex] = useState<number>(0);
  //切换tab
  const tabIndexChange = (e) => {
    setTabIndex(e);
  };
  //数据是否展示
  const [isEyeShow, setIsEyeShow] = useState<boolean>(false);
  const [list, setList] = useState([]);
  return (
    <>
      <Header title="我的众筹" recordText="明细记录" recordUrl="/recordList?type=myCrowdList&id=1" />
      <div className="my-crowd-page">
        <div className="card-box">
          <div className="card-header-top">
            <div className="left-option">
              <div className="hide-balance">
                <span className="spn-txt">参与总额</span>
                <img
                  src={isEyeShow ? showEyes : hide}
                  onClick={() => setIsEyeShow(!isEyeShow)}
                  className="icon"
                ></img>
              </div>
              <div className="ca-number">
                {getMask(1200, "*",isEyeShow)} CA
              </div>
            </div>
            <div className="right-option">
              <svg width="0" height="0">
                <defs>
                  <linearGradient
                    id="gradientColor"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3AE97D" />
                    <stop offset="100%" stopColor="#67BAFF" />
                  </linearGradient>
                </defs>
              </svg>
              <ProgressCircle
                percent={65}
                style={{
                  "--track-width": ".25rem",
                  "--fill-color": "url(#gradientColor)",
                  "--track-color": "rgba(255,255,255,0.1)",
                }}
              >
                <div className="progress-txt-color">65%</div>
              </ProgressCircle>
            </div>
          </div>
          <div className="card-txt-info-option">
            <div className="left-info">已赎回:100,236.78</div>
            <div className="right-info">
              <div className="right-number">
                <span className="spn-1">昨日</span>
                <span className="spn-2">+326.89</span>
              </div>
            </div>
          </div>

          <div className="card-txt-info-option">
            <div className="left-info">累计收益:100,236.78</div>
            <div className="right-info">
              <div className="right-icon">
                <RightOutline color="#fff" />
              </div>
            </div>
          </div>
        </div>

        <div className="rank-tab">
          {tabArray.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => tabIndexChange(index)}
                className={`tab-item ${tabIndex == item.id ? "active" : ""}`}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        {list.length === 0 ? (
          <NoData />
        ) : (
          list.map((crowd, index) => {
            const isSuccess = index % 2 === 0;
            return (
              <div
                className={`crowd-data ${isSuccess ? "success" : "error"}`}
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
          })
        )}
      </div>
    </>
  );
};

export default MyCrowd;
