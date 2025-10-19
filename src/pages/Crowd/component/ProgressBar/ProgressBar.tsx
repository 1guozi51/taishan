import React, { useState, useEffect } from "react";
import { Slider } from "antd-mobile";
import { BigNumber } from "ethers";
import "./ProgressBar.scss";
import { fromWei, toWei } from "@/Hooks/Utils";

interface ProgressBarProps {
  totalAmount: BigNumber; // 总量
  inputValue?: string; // 输入的值（字符串类型）
  disabled: boolean; //  是否禁用
  onChange?: (value: string) => void; // 滑动回调
}

const marks = {
  0: "0%",
  20: "20%",
  40: "40%",
  60: "60%",
  80: "80%",
  100: "100%",
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  totalAmount,
  inputValue,
  disabled,
  onChange,
}) => {
  const [percent, setPercent] = useState<number>(0);

  // 🎯 输入变化时自动匹配滑块位置
  useEffect(() => {
    if (!inputValue || totalAmount.isZero()) {
      setPercent(0);
      return;
    }

    try {
      const inputBN = toWei(inputValue); // 转成 BigNumber
      const calcPercent = inputBN.mul(100).div(totalAmount).toNumber();

      // 找最接近的档位（0、20、40、60、80、100）
      const markList = [0, 20, 40, 60, 80, 100];
      const nearest = markList.reduce((prev, curr) =>
        Math.abs(curr - calcPercent) < Math.abs(prev - calcPercent)
          ? curr
          : prev
      );

      // 如果超出范围 (<0 or >100)，就置为 0
      setPercent(calcPercent >= 0 && calcPercent <= 100 ? nearest : 0);
    } catch (err) {
      setPercent(0);
    }
  }, [inputValue, totalAmount]);

  // 🎯 滑动时更新百分比
  const handleChange = (value: number) => {
    setPercent(value);
    const valueBN = totalAmount.mul(value).div(100);
    if (onChange) onChange(fromWei(valueBN));
  };

  return (
    <div className="progress-container">
      <Slider
        ticks
        marks={marks}
        value={percent}
        onChange={handleChange}
        disabled={totalAmount.isZero()||disabled}
        className="custom-slider"
      />
    </div>
  );
};

export default ProgressBar;
