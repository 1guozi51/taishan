import "./index.scss";
import { useEffect, useState } from "react";
import { InfiniteScroll } from "antd-mobile";
import Header from "@/components/Header";
import { Spin } from "antd";
import showEyes from "@/assets/img/eyes.png";
import hide from "@/assets/img/hide-assets.png";
import { RightOutline } from "antd-mobile-icons";
import NoData from "@/components/NoData";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { formatDate, fromWei, getMask } from "@/Hooks/Utils";
import { t } from "i18next";
interface TabItem {
  id: number;
  name: string;
}
const statusList = [
  { text: "众筹成功", color: "success", status: 2 },
  { text: "众筹失败", color: "error", status: 3 },
  { text: "预约中", color: "success", status: 1 },
];
const tabArray: TabItem[] = [
  {
    id: 0,
    name: t("全部"),
  },
  {
    id: 2,
    name: t("参与成功"),
  },
  {
    id: 3,
    name: t("参与失败"),
  },
];
const MyCrowd: React.FC = () => {
  //钱包地址
  const wallertAddress = userAddress().address;
  // 列表是否加载
  const [listLoding, setListLoding] = useState<boolean>(false);
  //页面信息
  const [dataInfo, setDataInfo] = useState({});
  //tab下标
  const [tabIndex, setTabIndex] = useState<number>(0);

  //current
  const [current, setCurrent] = useState<number>(0);

  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);

  //切换tab
  const tabIndexChange = (e) => {
    setTabIndex(e);
  };
  //数据是否展示
  const [isEyeShow, setIsEyeShow] = useState<boolean>(false);
  //我的众筹记录
  const [list, setList] = useState<listItem[]>([]);
  const getPageData = async () => {
    const result = await NetworkRequest({
      Url: "userCrowdf/statistics",
      Method: "get",
      Data: {
        address: wallertAddress,
      },
    });
    if (result.data.code == 200) {
      setDataInfo(result.data.data);
    }
  };
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    setListLoding(true);
    await NetworkRequest({
      Url: "userCrowdf/crowdfDetailsRecord",
      Data: {
        current: nexPage,
        size: 10,
        address: wallertAddress,
        status: tabIndex == 0 ? "" : tabIndex,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length === 10) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
        setListLoding(false);
      } else {
        setListLoding(false);
      }
    });
  };

  const getList = async () => {
    setList([])
    setListLoding(true);
    const result = await NetworkRequest({
      Url: "userCrowdf/crowdfRecord",
      Method: "get",
      Data: {
        address: wallertAddress,
        size: 10,
        current: 1,
        status: tabIndex == 0 ? "" : tabIndex,
      },
    });
    if (result.data.code == 200) {
      setList((prevList) => [...prevList, ...result.data.data.records]);
      if (result.data.data.records.length === 10) {
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
    //切换tab 重新请求数据
    setCurrent(1);
    setList([]);
    getList();
  }, [tabIndex]);
  useEffect(() => {
    getPageData();
    getList();
  }, []);
  return (
    <>
      <Header
        title={t("我的众筹")}
        recordText={t("明细记录")}
        recordUrl="/recordList?type=myCrowdList&id=1"
      />
      <div className="my-crowd-page">
        <div className="card-box">
          <div className="card-header-top">
            <div className="left-option">
              <div className="hide-balance">
                <span className="spn-txt">{t("参与总额")}</span>
                <img
                  src={isEyeShow ? showEyes : hide}
                  onClick={() => setIsEyeShow(!isEyeShow)}
                  className="icon"
                ></img>
              </div>
              <div className="ca-number">
                {getMask(fromWei(dataInfo.partakeAmount), "*", isEyeShow)} CA
              </div>
            </div>
            <div className="right-option"></div>
          </div>
          <div className="card-txt-info-option">
            <div className="left-info">
              {t("已赎回")}:
              {getMask(fromWei(dataInfo.backAmount), "*", isEyeShow)}
            </div>
            <div className="right-info"></div>
          </div>

          <div className="card-txt-info-option">
            <div className="left-info">
              {t("累计收益")}:
              {getMask(fromWei(dataInfo.profitAmount), "*", isEyeShow)}
            </div>
            <div className="right-info">
              <div className="right-icon">
                <RightOutline color="#fff" />
              </div>
            </div>
          </div>
        </div>

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
        {list.length === 0 ? (
          <NoData />
        ) : (
          list.map((crowd, index) => {
            const status = statusList.find(
              (item) => item.status === crowd.status
            );

            return (
              <div className={`crowd-data ${status?.color || ""}`} key={index}>
                <div className="period-num">
                  {t("第")}
                  {crowd.crowdfNo}
                  {t("期")}
                </div>
                <div className="crowd-status">
                  <div className={`status ${status?.color || ""}`}>
                    {t(status?.text)}
                  </div>
                  <div className="time">
                    {formatDate(crowd.blockTime).dateTime}
                  </div>
                </div>

                <div className="data-row">
                  <div>
                    <div className="key">{t("总预约额")}</div>
                    <div className="val">{fromWei(crowd.crowdfAmount)} CA</div>
                  </div>
                  <div>
                    <div className="key">{t("我的参与额")}</div>
                    <div className="val">{fromWei(crowd.partakeAmount)} CA</div>
                  </div>
                </div>

                {status?.status != 1 && (
                  <div className="data-row">
                    <div>
                      <div className="key">{t("赎回本金")}</div>
                      <div className="val">{fromWei(crowd.backAmount)} CA</div>
                    </div>
                    <div>
                      <div className="key">{t("收益总额")}</div>
                      <div className="val">
                        {fromWei(crowd.profitAmount)} CA
                      </div>
                    </div>
                  </div>
                )}

                {Number(fromWei(crowd.compensateAmount)) > 0 && (
                  <div className="recoup-box">
                    <div>
                      <div className="key">{t("本金总补偿")}</div>
                      <div className="val">
                        {fromWei(crowd.compensateAmount)} CA
                      </div>
                    </div>
                    <div className="recoup-right-box">
                      <div className="key">{t("赠送矿机总价值")}</div>
                      <div className="val">
                        ={fromWei(crowd.compensateMiner)} CA
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

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
    </>
  );
};

export default MyCrowd;
