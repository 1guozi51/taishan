import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toTimestamp } from "@/Hooks/Utils";
import { t } from "i18next";
import "./index.scss";

interface CrowdInfo {
  startTime: string;
  endTime: string;
  // 其他字段可选
}

interface CountDownProps {
  crowdInfo: CrowdInfo;
}

const CountDown: React.FC<CountDownProps> = ({ crowdInfo }) => {
  // 倒计时秒数
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // 格式化后的时间
  const [prevTime, setPrevTime] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });

  // 初始化倒计时
  useEffect(() => {
    if (!crowdInfo?.endTime) return;

    // 转化为毫秒时间戳
    const endTimeMs = toTimestamp(crowdInfo.endTime);
    const startTimeMs = toTimestamp(crowdInfo.startTime);

    // 如果当前时间小于开始时间，则倒计时从开始时间开始
    const targetTime =
      Math.max(Date.now(), startTimeMs) > endTimeMs ? 0 : endTimeMs;

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
      setTimeLeft(diff);
    };
                                                                                                                            
    tick(); // 立即执行一次
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [crowdInfo]);

  // 计算天时分秒
  const days = Math.floor(timeLeft / (24 * 3600))
    .toString()
    .padStart(2, "0");
  const hours = Math.floor((timeLeft % (24 * 3600)) / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((timeLeft % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(timeLeft % 60)
    .toString()
    .padStart(2, "0");

  const time = { d: days, h: hours, m: minutes, s: seconds };

  // 保存前一次时间，用于动画比较
  useEffect(() => {
    setPrevTime(time);
  }, [time.d, time.h, time.m, time.s]);

  // 时间块动画组件
  const TimeBlock: React.FC<{
    value: string;
    prevValue: string;
    active: boolean;
    label?: string;
  }> = ({ value, prevValue, active, label }) => {
    return (
      <div className="djs-item">
        <AnimatePresence mode="wait">
          <motion.div
            key={active ? value : prevValue}
            initial={active ? { y: -30, opacity: 0 } : {}}
            animate={active ? { y: 0, opacity: 1 } : {}}
            exit={active ? { y: 30, opacity: 0 } : {}}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span>{value}</span>
            {label && <span className="label">{label}</span>}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="count-down-box">
      <div className="djs-list">
        {parseInt(time.d) > 0 && (
          <>
            <TimeBlock
              value={time.d}
              prevValue={prevTime.d}
              active={time.d !== prevTime.d}
            />
            <div>:</div>
          </>
        )}
        <TimeBlock
          value={time.h}
          prevValue={prevTime.h}
          active={time.h !== prevTime.h}
        />
        <div>:</div>
        <TimeBlock
          value={time.m}
          prevValue={prevTime.m}
          active={time.m !== prevTime.m}
        />
        <div>:</div>
        <TimeBlock
          value={time.s}
          prevValue={prevTime.s}
          active={time.s !== prevTime.s}
        />
      </div>
    </div>
  );
};

export default CountDown;
