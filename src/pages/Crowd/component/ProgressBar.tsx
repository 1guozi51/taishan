import React from "react";
import "./ProgressBar.css";
import { Slider} from 'antd-mobile'

const marks = {
  0: 0,
  20: 20,
  40: 40,
  60: 60,
  80: 80,
  100: 100,
}

interface ProgressBarProps {
  /** 当前步骤（从 1 开始） */
  currentStep: number;
  /** 总步骤数 */
  totalSteps?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps = 5 }) => {
  return (
    <div className="progress-container">
        <Slider ticks   className="custom-slider" marks={marks} step={20} />
    </div>
  );
};

export default ProgressBar;
