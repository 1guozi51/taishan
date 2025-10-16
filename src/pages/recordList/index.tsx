import "./index.scss";
import BackHeader from "@/components/BackHeader";
import i18n, { t } from "i18next";
import { useLocation } from "react-router-dom";
import TicketRecord from "./component/record/index";
import Team from "./component/Team/index";
import Node from "./component/Node/index";
import WithdrawRecord from "./component/WithdrawRecord/index";
const RecordList: React.FC = () => {
  const location = useLocation();
  // 解析查询参数
  const searchParams = new URLSearchParams(location.search);
  const pageType = searchParams.get("type");

  //通过类型去给header标题赋值
  const getBackHeaderTitle = (val: string | null) => {
    switch (val) {
      case "tickets":
        return t("门票");
      case "team":
        return t("领取记录");
      case "node":
        return t("领取记录");
      case "withdrawRecord":
        return t("提现记录");
      default:
        return "记录";
    }
  };

  const renderRecordComponent = () => {
    switch (pageType) {
      case "tickets":
        return <TicketRecord />;
      case "team":
        return <Team pathParam={searchParams} />;
      case "node":
        return <Node pathParam={searchParams} />;
      case "withdrawRecord":
        return <WithdrawRecord />;
      default:
        return <div>{t("暂无记录")}</div>;
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
