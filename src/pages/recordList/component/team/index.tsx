import "./index.scss";
import NoData from "@/components/NoData";
import { useEffect, useState, useCallback } from "react";
import { userAddress } from "@/Store/Store.ts";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { InfiniteScroll } from "antd-mobile";
import { Spin } from "antd";
import { fromWei, formatDate } from "@/Hooks/Utils.ts";
import { t } from "i18next";

interface TeamRecord {
  blockTime: string;
  status: number;
  amount: string;
}

const Team: React.FC<{ pathParam: URLSearchParams }> = ({ pathParam }) => {
  //通过searchParams参数获取id值
  const typeId = pathParam.get("id");
  // const wallertAddress = "0x658b8ff0bac39276a02b7f32944c69158d82a97b";
  const wallertAddress = userAddress((state) => state.address);
  const [list, setList] = useState<TeamRecord[]>([]);
  // 列表是否加载
  const [listLoding, setListLoding] = useState(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState(false);
  const [dataParam, setDataParam] = useState({
    address: wallertAddress,
    current: 1,
    size: 200,
    type: typeId,
    total: "", //总数
  });
  const [current, setCurrent] = useState(1);
  // 获取更多团队列表
  const loadMoreAction = async () => {
    setDataParam((prevState) => ({
      ...prevState,
    }));
    await NetworkRequest({
      Url: "userRecord/rewardRecord",
      Data: {
        ...dataParam,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length === 10) {
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
      Url: "userRecord/rewardRecord",
      Data: {
        ...dataParam,
      },
    });
    if (result.data.code === 200) {
      setList(result.data.data.records);
      setDataParam((prevState) => ({
        ...prevState,
        total: result.data.data.total,
      }));
      if (result.data.data.records.length === 10) {
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
      <div className="records-page">
        <div className="records-list">
          <div className="record-head">
            <span>{t("时间")}</span>
            <span>{t("是否领取")}</span>
            <span>{t("收益")}</span>
          </div>
          {list.length == 0 ? (
            <NoData />
          ) : (
            <div className="record-body">
              {list.map((item, index) => {
                return (
                  <div className="record-item" key={index}>
                    <span>{formatDate(item.createTime).dateTime}</span>
                    <span>{item.status == 1 ? t("待领取") : t("已领取")}</span>
                    <span>
                      {typeId == 101||typeId == 103
                        ? fromWei(item.usdtAmount)
                        : fromWei(item.caAmount)}
                    </span>
                  </div>
                );
              })}
              {/* <InfiniteScroll loadMore={loadMoreAction} hasMore={isMore}>
                <div>
                  {listLoding && (
                    <div className="loding flex flexCenter">
                      <Spin />
                    </div>
                  )}
                </div>
              </InfiniteScroll> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Team;
