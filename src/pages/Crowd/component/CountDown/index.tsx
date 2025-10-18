import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.scss";
import { t } from "i18next";

interface CountDownProps {
  targetTime: number; // 毫秒或秒级时间戳
  onEnd?: () => void;
}

const CountDown: React.FC<CountDownProps> = ({ targetTime, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [prevTime, setPrevTime] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });

  useEffect(() => {
    const target = targetTime < 1e12 ? targetTime * 1000 : targetTime;

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((target - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0 && onEnd) onEnd();
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetTime, onEnd]);

  // 🧮 计算时间
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

  useEffect(() => {
    setPrevTime(time);
  }, [time.d, time.h, time.m, time.s]);

  /** 单个时间块（仅当变化时触发动画） */
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
              label={t("天")}
            />
            <div>:</div>
          </>
        )}
        <TimeBlock
          value={time.h}
          prevValue={prevTime.h}
          active={time.h !== prevTime.h}
          label={t("时")}
        />
        <div>:</div>
        <TimeBlock
          value={time.m}
          prevValue={prevTime.m}
          active={time.m !== prevTime.m}
          label={t("分")}
        />
        <div>:</div>
        <TimeBlock
          value={time.s}
          prevValue={prevTime.s}
          active={time.s !== prevTime.s}
          label={t("秒")}
        />
      </div>
    </div>
  );
};

export default CountDown;
