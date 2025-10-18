import "./index.scss";
import React from "react";
import noData from "@/assets/img/no-data.png";
import { t } from "i18next";
const NoData: React.FC = () => {
  return (
    <div className="no-data">
      <img src={noData} alt="" />
      <span>{t("暂无数据")}</span>
    </div>
  )
};
export default NoData;
