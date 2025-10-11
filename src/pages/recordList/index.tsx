import "./index.scss";
import BackHeader from "@/components/BackHeader";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TicketRecord from "./component/record/index";
import Team from "./component/Team/index";
const RecordList: React.FC = () => {
  const location = useLocation();
  // 解析查询参数
  const searchParams = new URLSearchParams(location.search);
  const pageType = searchParams.get("type");
    
  //通过类型去给header标题赋值
  const getBackHeaderTitle = (val: string | null) => {
    switch (val) {
      case "tickets":
        return "门票记录";
      case "team":
        return "领取记录";
      default:
        return "记录";
    }
  };

  const renderRecordComponent = () => {
    switch (pageType) {
      case "tickets":
        return <TicketRecord/>;
      case "team":
        return <Team pathParam={searchParams}/>;
      default:
        return <div>暂无记录</div>;
    }
  };

  return (
    <>
      <BackHeader title={getBackHeaderTitle(pageType)} />
      <div>{renderRecordComponent()}</div>
    </>
  );
};

export default RecordList;
