import "./index.scss";
import NoData from "@/components/NoData";
import { useEffect, useState, useCallback } from "react";
import { userAddress } from "@/Store/Store.ts";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { InfiniteScroll } from "antd-mobile";
import { Spin } from "antd";
import { RightOutline } from "antd-mobile-icons";

import { fromWei, formatDate } from "@/Hooks/Utils.ts";
import { t } from "i18next";
import type { BigNumber } from "ethers";

interface TabItem {
  id: number;
  name: string;
}

const tabArray: TabItem[] = [
  {
    id: 0,
    name: t("预约记录"),
  },
  {
    id: 1,
    name: t("赎回记录"),
  },
  {
    id: 2,
    name: t("补偿记录"),
  },
  {
    id: 3,
    name: t("收益记录"),
  },
];
interface listItem {
  address: string;
  backAmount: string | number;
  blockNum: string | number;
  blockTime: string | number;
  compensateAmount: string;
  compensateMiner: string;
  crowdfAmount: string;
  crowdfNo: string | number;
  endTime: string;
  id: number;
  partakeAmount: BigNumber;
  profitAmount: string;
  startTime: string;
  status: string;
}
const labelMap = {
  0: { text: t("预约额度(CA)") },
  1: { text: t("赎回额度(CA)") },
  2: { text: t("补偿本金(CA)") },
  3: { text: t("收益金额(CA)") },
};

const RecordTabIndexZero = ({ item, tabIndex }) => {
  return (
    <div className="record-item">
      <div className="item-content">
        <span>{formatDate(item.blockTime).dateTime}</span>
        <span>
          {t("第")}
          {item.crowdfNo}
          {t("期")}
        </span>
        <span
          className={
            item.status == "1"
              ? "status status-booked"
              : item.status == "2"
              ? "status status-success"
              : "status status-failed"
          }
        >
          {item.status == "1"
            ? t("预约中")
            : item.status == "2"
            ? t("参与成功")
            : t("参与失败")}
        </span>
        <span className={item.status != 1 ? "status status-success" : ""}>
          {fromWei(item.partakeAmount)}
        </span>
      </div>
      
    </div>
  );
};

const RecordTabIndexOthter = ({ item, tabIndex }) => {
  return (
    <div className="record-item">
      <div className="item-content">
        <span>{formatDate(item.createTime).dateTime}</span>
        <span>
          {t("第")}
          {item.crowdfNo}
          {t("期")}
        </span>
        <span
          className={
            item.allocateStatus == "1"
              ? "status status-booked"
              : item.allocateStatus == "2"
              ? "status status-success"
              : "status status-failed"
          }
        >
          {item.allocateStatus == "1"
            ? t("预约中")
            : item.allocateStatus == "2"
            ? t("参与成功")
            : t("参与失败")}
        </span>
        <span className={tabIndex != "0" ? "status status-success" : ""}>
          {fromWei(item.amount)}
        </span>
      </div>
      <div
        className="tag-option"
        style={{ display: tabIndex === 2 ? "flex" : "none" }}
      >
        <div className="tag-name">{t("赠送")}</div>
        <div className="tag-txt">
          {t("赠送价值")}
          <span>{fromWei(item.minerAmount)} CA</span>
          {t(`矿机*1台`)}
        </div>
        <div className="tag-right">
          <RightOutline color="#F39D24" />
        </div>
      </div>
    </div>
  );
};
const MiningMachine: React.FC<{ pathParam: URLSearchParams }> = ({
  pathParam,
}) => {
  //通过searchParams参数获取id值
  const typeId = pathParam.get("id");
  const wallertAddress = userAddress().address;
  const [list, setList] = useState<listItem[]>([]);
  // 列表是否加载
  const [listLoding, setListLoding] = useState<boolean>(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [dataParam, setDataParam] = useState({
    address: wallertAddress,
    current: 1,
    size: 20,
    type: typeId,
  });
  //tab下标
  const [tabIndex, setTabIndex] = useState<string>("0");
  const tabIndexChange = (index) => {
    setTabIndex(index);
  };
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    let Url = "";
    let Data = {
      current: nexPage,
      size: dataParam.size,
      type: tabIndex,
      address: dataParam.address,
    };
    if (tabIndex != "0") {
      Url = "userCrowdf/crowdfDetailsRecord";
    } else {
      Url = "userCrowdf/crowdfRecord";
      Data.status = "";
      delete Data.type;
    }
    await NetworkRequest({
      Url,
      Data,
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length === dataParam.size) {
          console.log("list==", list.length);
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };
  const getDataList = async (type) => {
    let Url = "";
    let Data = {
      current: 1,
      size: dataParam.size,
      type: tabIndex,
      address: dataParam.address,
    };

    if (tabIndex != "0") {
      Url = "userCrowdf/crowdfDetailsRecord";
    } else {
      Url = "userCrowdf/crowdfRecord";
      Data.status = "";
      delete Data.type;
    }

    setListLoding(true);
    const result = await NetworkRequest({
      Url,
      Data,
    });
    if (result.data.code === 200) {
      setList((prevList) => [...prevList, ...result.data.data.records]);
      if (result.data.data.records.length === dataParam.size) {
        setIsMore(true);
      } else {
        setIsMore(false);
      }
      setListLoding(false);
    } else {
      setListLoding(false);
    }
  };
  useEffect(() => {
    setList([]);
    getDataList(tabIndex);
  }, [tabIndex]);
  return (
    <>
      <div className="records-my-crow-page">
        <div className="rank-tab">
          {tabArray.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => tabIndexChange(item.id)}
                className={`tab-item ${tabIndex == item.id ? "active" : ""}`}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        <div className="records-list">
          <div className="record-head">
            <div className="item-content">
              <span>{t("时间")}</span>
              <span>{t("期数")}</span>
              <span>{t("状态")}</span>
              <span>{labelMap[tabIndex]?.text || "预约额度(CA)"}</span>
            </div>
          </div>
          {list.length == 0 ? (
            <NoData />
          ) : (
            <div className="record-body">
              {list.map((item, index) => (
                <div key={index}>
                  {tabIndex == "0" ? (
                    <RecordTabIndexZero item={item} tabIndex={tabIndex} />
                  ) : (
                    <RecordTabIndexOthter item={item} tabIndex={tabIndex} />
                  )}
                </div>
              ))}

              <InfiniteScroll loadMore={loadMoreAction} hasMore={isMore}>
                <div>
                  {listLoding && (
                    <div className="loding flex flexCenter">
                      <Spin />
                    </div>
                  )}
                </div>
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MiningMachine;
