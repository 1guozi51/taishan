import "./index.scss";
import NoData from "@/components/NoData";
import { useEffect, useState } from "react";
import { userAddress } from "@/Store/Store.ts";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { InfiniteScroll } from "antd-mobile";
import { Spin} from "antd";
import { t } from "i18next";

import { fromWei, formatDate } from "@/Hooks/Utils.ts";
const Record: React.FC = () => {
  const wallertAddress = userAddress().address;
  const [list, setList] = useState([]);
  // 列表是否加载
  const [listLoding, setListLoding] = useState(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState(false);
  const [dataParam, setDataParam] = useState({
    address: wallertAddress,
    current: 1,
    size: 10,
    total: "", //总数
  });
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = dataParam.current + 1;

    setDataParam((prevState) => ({
      ...prevState,
      current: nexPage,
    }));
    await NetworkRequest({
      Url: "userRecord/ticketRecord",
      Data: {
        ...dataParam,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length == 10) {
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
        ...dataParam,
      },
    });
    if (result.data.code == 200) {
      setList(result.data.data.records);

      setDataParam((prevState) => ({
        ...prevState,
        total: result.data.data.total,
      }));
      if (result.data.data.records.length == 10) {
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
            <span>{t('时间')}</span>
            <span>{t('获取')}GAS</span>
            <span>{t('支付')}USDT</span>
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
