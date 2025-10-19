import "./index.scss";
import NoData from "@/components/NoData";
import { useEffect, useState, useCallback } from "react";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { userAddress } from "@/Store/Store.ts";

import { InfiniteScroll } from "antd-mobile";
import { Spin } from "antd";
import { fromWei, formatDate } from "@/Hooks/Utils.ts";
import { t } from "i18next";
import type { BigNumber } from "ethers";
interface searchParam {
  current: number | string;
  size: number | string;
  address?: string;
}
interface SwapRecord {
  blockTime: string;
  type: number;
  amount0: BigNumber;
  amount1: BigNumber;
}

const Swap: React.FC<{ pathParam: URLSearchParams }> = ({ pathParam }) => {
  const params = pathParam.get("id"); //all 查询全部记录 me 自己
  //地址
  const wallertAddress = userAddress().address;

  //通过searchParams参数获取id值
  const [list, setList] = useState<SwapRecord[]>([]);
  // 列表是否加载
  const [listLoding, setListLoding] = useState<boolean>(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [dataParam, setDataParam] = useState({
    current: 1,
    size: 20,
  });
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = current + 1;

    const Data: searchParam = {
      current: nexPage,
      size: dataParam.size,
    };

    if (params == "me") {
      Data.address = wallertAddress;
    }
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "userRecord/swapRecord",
      Data
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length === dataParam.size) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };
  const getDataList = useCallback(async () => {
    setListLoding(true);

     const Data: searchParam = {
      current: 1,
      size: dataParam.size,
    };

    if (params == "me") {
      Data.address = wallertAddress;
    }
    const result = await NetworkRequest({
      Url: "userRecord/swapRecord",
      Data
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
      <div className="records-swap-page">
        <div className="records-list">
          <div className="record-head">
            <span>{t("时间")}</span>
            <span className="span-2">{t("交易对")}</span>
            <span>{t("状态")}</span>
          </div>
          {list.length == 0 ? (
            <NoData />
          ) : (
            <div className="record-body">
              {list.map((item, index) => {
                return (
                  <div className="record-item" key={index}>
                    <span>{formatDate(item.blockTime).dateTime}</span>
                    <span className="span-2">
                      {fromWei(item.amount0,18,true,3)}{" "}
                      {item.type == 1 ? "USDT" : "CA"} {" "}{'=>'}{" "}
                      {fromWei(item.amount1,18,true,3)} {item.type == 1 ? "CA" : "USDT"}
                    </span>
                    <span>{t("已完成")}</span>
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

export default Swap;
