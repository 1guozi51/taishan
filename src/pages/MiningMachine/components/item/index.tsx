import "./index.scss";
import { ProgressCircle } from "antd-mobile";

import { RightOutline } from "antd-mobile-icons";
const Item: React.FC = () => {
  return (
    <div className="mining-machine-item-page mining-machine-item-success-page">
      <div className="absolute-tag">#176-00083</div>

      <div className="top-info-option">
        <div className="right-option">
          <div className="status-txt">
            <div className="status-bg-color"></div>
            <div className="status-name">挖矿中</div>
          </div>
          <div className="time-txt">09/05/2025 18:25:56</div>
        </div>
      </div>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3AE97D" />
            <stop offset="100%" stopColor="#67BAFF" />
          </linearGradient>
        </defs>
      </svg>

      <div className="content-info-option">
        <div className="progress-bar">
          <ProgressCircle
            percent={65}
            style={{
               '--track-width': '4px',
              "--fill-color": "url(#gradientColor)",
              "--track-color": "rgba(255,255,255,0.1)",
            }}
          >
            65%
          </ProgressCircle>
        </div>
        <div className="right-option">
          <div className="flex-1-info">
            <div className="txt-one">最大产值</div>
            <div className="txt-two">20,000.00 CA</div>
          </div>

          <div className="flex-1-info">
            <div className="txt-one">已收益</div>
            <div className="txt-two">20,000.00 CA</div>
          </div>
        </div>
      </div>

      <div className="end-option">
        <div className="left-option">
          <span className="left-name">昨日收益:</span>
          <span className="left-num">+86.32</span>
        </div>
        <div className="right-icon">
          <RightOutline color="#fff" />
        </div>
      </div>
    </div>
  );
};

export default Item;
