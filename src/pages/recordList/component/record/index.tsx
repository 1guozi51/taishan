import "./index.scss";
import NoData from "@/components/NoData";
import { useEffect, useState } from "react";
import { userAddress } from "@/Store/Store.ts";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { InfiniteScroll } from "antd-mobile";
import { Spin } from "antd";
import { t } from "i18next";

import { fromWei, formatDate } from "@/Hooks/Utils.ts";
const Record: React.FC = () => {
  const wallertAddress = userAddress().address;
  const [list, setList] = useState([]);
  // 列表是否加载
  const [listLoding, setListLoding] = useState<boolean>(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [dataParam, setDataParam] = useState({
    address: wallertAddress,
    current: 1,
    size: 20,
  });
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "userRecord/ticketRecord",
      Data: {
        current: nexPage,
        size: dataParam.size,
        type: dataParam.type,
        address: dataParam.address,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length == dataParam.size) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };

  const getDataList = async () => {
    setListLoding(true);
    const result = await NetworkRequest({
      Url: "userRecord/ticketRecord",
      Data: {
        current: 1,
        size: dataParam.size,
        address: dataParam.address,
      },
    });
    if (result.data.code == 200) {
      setList((prevList) => [...prevList, ...result.data.data.records]);

      if (result.data.data.records.length == dataParam.size) {
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
    getDataList();
  }, []);
  return (
    <>
      <div className="records-page">
        <div className="records-list">
          <div className="record-head">
            <span>{t("时间")}</span>
            <span>{t("获取")}GAS</span>
            <span>{t("支付")}USDT</span>
          </div>
          {list.length == 0 ? (
            <NoData />
          ) : (
            <div className="record-body">
              {list.map((item, index) => {
                return (
                  <div className="record-item" key={index}>
                    <span>{formatDate(item.blockTime).dateTime}</span>
                    <span>{fromWei(item.gas)}</span>
                    <span>{fromWei(item.amount)}</span>
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

export default Record;
