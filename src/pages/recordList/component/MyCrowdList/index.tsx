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
interface TeamRecord {
  blockTime: string;
  amount: string;
}

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

const labelMap = {
  0: { text: t("预约额度(CA)") },
  1: { text: t("赎回额度(CA)") },
  2: { text: t("补偿本金(CA)") },
  3: { text: t("收益金额(CA)") },
};
const MiningMachine: React.FC<{ pathParam: URLSearchParams }> = ({
  pathParam,
}) => {
  //通过searchParams参数获取id值
  const typeId = pathParam.get("id");
  const wallertAddress = userAddress().address;
  const [list, setList] = useState<TeamRecord[]>([]);
  const list2 = [
    {
      one: "1",
      two: "1",
      status: "1", //1 预约 2参与成功 3参与失败
      type: 0, //0正常 1补偿
      amount: 12,
    },
    {
      one: "1",
      two: "1",
      status: "2", //1 预约 2参与成功 3参与失败
      type: 0, //0正常 1补偿
      amount: 12,
    },
    {
      one: "1",
      two: "1",
      status: "3", //1 预约 2参与成功 3参与失败
      type: 0, //0正常 1补偿
      amount: 12,
    },
  ];
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
  const [tabIndex, setTabIndex] = useState<number>(0);
  const tabIndexChange = (index) => {
    setTabIndex(index);
  };
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "userRecord/claimMinerRecord",
      Data: {
        current: nexPage,
        size: dataParam.size,
        type: dataParam.type,
        address: dataParam.address,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        console.log(
          "res.data.data.records.length ==",
          res.data.data.records.length
        );
        if (res.data.data.records.length === dataParam.size) {
          console.log("list==", list.length);
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };
  const getDataList = useCallback(async () => {
    setListLoding(true);
    const result = await NetworkRequest({
      Url: "userRecord/claimMinerRecord",
      Data: {
        current: 1,
        size: dataParam.size,
        type: dataParam.type,
        address: dataParam.address,
      },
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
  }, [dataParam]);
  useEffect(() => {
    getDataList();
  }, []);
  return (
    <>
      <div className="records-my-crow-page">
        <div className="rank-tab">
          {tabArray.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => tabIndexChange(index)}
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
          {list2.length == 0 ? (
            <NoData />
          ) : (
            <div className="record-body">
              {list2.map((item, index) => {
                return (
                  <div className="record-item" key={index}>
                    <div className="item-content">
                      <span>{item.one}</span>
                      <span>{t("第")}180</span>
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
                      <span
                        className={
                          tabIndex != "0" ? "status status-success" : ""
                        }
                      >
                        {item.amount}
                      </span>
                    </div>
                    <div
                      className="tag-option"
                      style={{ display: tabIndex === 2 ? "flex" : "none" }}
                    >
                      <div className="tag-name">{t("赠送")}</div>
                      <div className="tag-txt">
                        {t("赠送价值")}
                        <span>6,000.00 CA</span>
                        {t("矿机*1台")}
                      </div>
                      <div className="tag-right">
                        <RightOutline color="#F39D24" />
                      </div>
                    </div>
                  </div>
                );
              })}
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
