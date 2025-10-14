import React, { useState } from "react";
import "./index.scss";

interface DiceProps {
  size?: number; // 像素大小
  disabled?: boolean;
  onRoll?: (value: number) => void;
  // 受控：持续旋转直到收到 target
  running?: boolean;
  // 受控目标点数；当提供 1-6 时会令骰子停到该点
  target?: number | null;
}

const Dice: React.FC<DiceProps> = ({ size = 64, disabled = false, onRoll, running, target = null }) => {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<number>(1);
  const [transform, setTransform] = useState<string>(`rotateX(-20deg) rotateY(20deg)`);
  const [spinning, setSpinning] = useState<boolean>(false);

  // 根据点数计算最终的立方体旋转角度（使对应面朝前）
  const getTransformForValue = (v: number, extraRotations = 2) => {
    // 基础角度让骰子稍微倾斜
    // 为每个面定义一个朝前的角度（单位 deg）
    // 面的映射：1 - front, 2 - right, 3 - back, 4 - left, 5 - top, 6 - bottom
    const faceAngles: Record<number, { x: number; y: number; z?: number }> = {
      1: { x: 0, y: 0 },
      2: { x: 0, y: -90 },
      3: { x: 0, y: 180 },
      4: { x: 0, y: 90 },
      5: { x: 90, y: 0 },
      6: { x: -90, y: 0 },
    };
    const base = faceAngles[v] || faceAngles[1];
    // 添加整圈旋转以产生滚动效果
    const rotX = base.x + extraRotations * 360;
    const rotY = base.y + extraRotations * 360;
    return `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const roll = () => {
    if (disabled || rolling || spinning) return;
    setRolling(true);
    const next = Math.floor(Math.random() * 6) + 1;
  // 让动画时长与 CSS 动画一致（3s）
  const duration = 3000;
    // 在开始时触发一个更强的旋转（视觉上看得到翻转）
    setTransform(`rotateX(${720}deg) rotateY(${360}deg)`);
    // 最终停在目标面的 transform
    setTimeout(() => {
      const final = getTransformForValue(next, 1);
      setTransform(final);
      setValue(next);
      setRolling(false);
      if (onRoll) {
        onRoll(next);
      }
    }, duration);
  };

  // 监听 running，开启或停止无限旋转
  React.useEffect(() => {
    if (running) {
      setSpinning(true);
      // 清空 transform 使 CSS 动画可见
      setTransform("");
    } else {
      setSpinning(false);
      // 恢复默认角度
      setTransform(`rotateX(-20deg) rotateY(20deg)`);
    }
  }, [running]);

  // 监听 target：当 spinning 时收到 target 则平滑停到目标面
  React.useEffect(() => {
    if (typeof target === "number" && target >= 1 && target <= 6) {
      // 如果目前处于持续旋转状态，则先停止 spinning，再过渡到目标面
          if (spinning) {
            setSpinning(false);
            // 确保动画样式停用后再设置最终 transform
            setTimeout(() => {
              setRolling(true);
              const final = getTransformForValue(target, 1);
              setTransform(final);
              setTimeout(() => {
                setValue(target);
                setRolling(false);
                if (onRoll) onRoll(target);
              }, 3000);
            }, 60);
      } else {
        // 非 spinning 直接过渡
        setRolling(true);
        const final = getTransformForValue(target, 1);
        setTransform(final);
            setTimeout(() => {
              setValue(target);
              setRolling(false);
              if (onRoll) onRoll(target);
            }, 3000);
      }
    }
  }, [target, spinning, onRoll]);

  return (
    <div
      className={`dice-root ${rolling ? "rolling" : ""} ${disabled ? "disabled" : ""} ${spinning ? "spinning" : ""}`}
      style={{ width: size, height: size }}
      onClick={() => roll()}
      role="button"
      aria-label={`骰子，当前点数 ${value}`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          roll();
        }
      }}
    >
  <div className="cube" style={{ transform }}>
        <div className={`face face-1`}>{/* 1 */}
          <span className="dot center" />
        </div>
        <div className={`face face-2`}>
          <span className="dot top-left" />
          <span className="dot bottom-right" />
        </div>
        <div className={`face face-3`}>
          <span className="dot top-left" />
          <span className="dot center" />
          <span className="dot bottom-right" />
        </div>
        <div className={`face face-4`}>
          <span className="dot top-left" />
          <span className="dot top-right" />
          <span className="dot bottom-left" />
          <span className="dot bottom-right" />
        </div>
        <div className={`face face-5`}>
          <span className="dot top-left" />
          <span className="dot top-right" />
          <span className="dot center" />
          <span className="dot bottom-left" />
          <span className="dot bottom-right" />
        </div>
        <div className={`face face-6`}>
          <span className="dot top-left" />
          <span className="dot top-right" />
          <span className="dot middle-left" />
          <span className="dot middle-right" />
          <span className="dot bottom-left" />
          <span className="dot bottom-right" />
        </div>
      </div>
    </div>
  );
};

export default Dice;
