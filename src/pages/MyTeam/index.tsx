import "./index.scss";
import { useState, useEffect } from "react";
import copy from "@/assets/img/copy.png";
import wallet from "@/assets/img/wallet.png";
import { Button, InfiniteScroll } from "antd-mobile";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { Spin, Empty } from "antd";
import { Totast, fromWei, SubAddress, formatDate } from "@/Hooks/Utils.ts";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { concatSign } from "@/Hooks/Utils.ts";
import { UseSignMessage } from "@/Hooks/UseSignMessage.ts";
import BackHeader from "@/components/BackHeader";

const MyTeam: React.FC = () => {
  const navigate = useNavigate();
  const { signMessage } = UseSignMessage();
  const wallertAddress = userAddress().address;
  // const wallertAddress = "0x708fa021d9a6a827eca68ca490042a57c1621c5d";
  const [teamInfo, setTeamInfo] = useState({});
  const [location, setLocation] = useState("");
  const [tabIndex, setTabIndex] = useState(1); //1团队列表 2代表33团队
  const [btnLoading, setBtnLoading] = useState(false);
  const [list, setList] = useState([]);
  // 列表是否加载
  const [listLoding, setListLoding] = useState(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState(false);
  const [total, setTotal] = useState("");
  const [current, setCurrent] = useState(1);
  const [dataParam, setDataParam] = useState({
    address: wallertAddress,
    size: 10,
  });
  //重置请求参数和请求数据
  const resetList = () => {
    setDataParam({
      size: 10,
      address: wallertAddress,
    });
    setCurrent(1);
    setTotal("");
    setList([]);
  };

  const tabChange = (type) => {
    resetList();
    setTabIndex(type);
    if (type == 1) {
      getDataList({
        Url: "user/teamChild",
        Data: {
          current: 1,
          size: 10,
          address: wallertAddress,
        },
      });
    } else {
      getDataList33({
        Url: "user/team33Child",
        Data: {
          address: wallertAddress,
        },
      });
    }
  };
  const PathNav = (url) => {
    navigate(url);
  };
  const copyAction = () => {
    //获取window浏览器地址
    const input = document.createElement("textarea");
    input.value = location + "?invite=" + wallertAddress;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    Totast("复制成功", "success"); // 复制成功
  };
  const getPageInfo = async () => {
    setLocation(window.location.origin);
    await NetworkRequest({
      Url: "user/teamInfo",
      Data: {
        address: wallertAddress,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        setTeamInfo(res.data.data);
      }
    });
  };
  const getDataList = async ({ Url, Data }) => {
    setListLoding(true);
    const result = await NetworkRequest({
      Url,
      Data,
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

  const getDataList33 = async ({ Url, Data }) => {
    setListLoding(true);
    await NetworkRequest({
      Url,
      Data,
    }).then((res) => {
      setListLoding(false);
      console.log("res===", res);
      if (res.data.code == 200) {
        setList(res.data.data);
      }
    });
  };
  // 获取更多团队列表
  const loadMoreAction = async () => {
    if (tabIndex == 2) {
      return;
    }
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "user/teamChild",
      Data: {
        address: wallertAddress,
        size: 10,
        current: nexPage,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length == 10) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
        console.log("list====", list);
      }
    });
  };
  //待领取奖励 type 领取对应类型的奖励
  const claimTeamClick = async (type, amount) => {
    if (fromWei(amount) == 0) {
      Totast("不能领取", "warning");
      return;
    }
    if (btnLoading) return; // 防止重复点击
    const bigRes = concatSign(fromWei(amount));
    setBtnLoading(true);
    const sigResult = await signMessage(bigRes);
    if (sigResult) {
      await NetworkRequest({
        Url: "userRecord/claimTeam",
        Method: "POST",
        Data: {
          address: wallertAddress,
          type,
          msg: bigRes,
          signature: sigResult,
        },
      })
        .then((res) => {
          Totast("领取成功", "success");
          getPageInfo();
        })
        .finally(() => {
          setBtnLoading(false);
        });
    } else {
      setBtnLoading(false);
    }
  };
  useEffect(() => {
    getPageInfo();
    tabChange(1);
  }, []);
  return (
    <>
     <BackHeader title='团队' /> 
      <div
        style={{ padding: "0 16px", background: "#03022c", minHeight: "100vh" }}
      >
       
        <div className="teamInfo">
          <div>
            {" "}
            <span>{t("团队人数")}</span> <span>{t("直推人数")}</span>{" "}
          </div>
          <div>
            {" "}
            <span>{teamInfo.teamCount || 0}</span>{" "}
            <span>{teamInfo.directCount || 0}</span>{" "}
          </div>
          <div>
            {" "}
            <span>{t("团队业绩")}</span> <span>{t("小区业绩")}</span>{" "}
          </div>
          <div>
            {" "}
            <span>{fromWei(teamInfo.teamPerf)} USDT</span>{" "}
            <span>{fromWei(teamInfo.communityPerf)} USDT</span>{" "}
          </div>
        </div>
        <div className="awardButton">
          <div className="record boxBorder">
            <div className="record-txt">{t("累计领取奖励")}(USDT)</div>
            <div>{fromWei(teamInfo.teamUsdtReward)}</div>
            <Button
              onClick={() => {
                PathNav("/recordList?type=team&id=101");
              }}
            >
              {t("记录")}
            </Button>
          </div>
          <div className="record boxBorder">
            <div> {t("待领取奖励")}(USDT)</div>
            <div>{fromWei(teamInfo.teamUsdtClaimReward)}</div>
            <Button
              disabled={btnLoading}
              onClick={() => {
                claimTeamClick(101, teamInfo.teamUsdtClaimReward);
              }}
            >
              {t("领取")}
            </Button>
          </div>
        </div>

        <div className="awardButton">
          <div className="record boxBorder">
            <div>{t("累计领取奖励")}(CA)</div>
            <div>{fromWei(teamInfo.teamCaReward)}</div>
            <Button
              onClick={() => {
                PathNav("/recordList?type=team&id=102");
              }}
            >
              {t("记录")}
            </Button>
          </div>
          <div className="record boxBorder">
            <div>{t("待领取奖励")}(CA)</div>
            <div>{fromWei(teamInfo.teamCaClaimReward)}</div>
            <Button
              disabled={btnLoading}
              onClick={() => {
                claimTeamClick(103, teamInfo.teamCaClaimReward);
              }}
            >
              {t("领取")}
            </Button>
          </div>
        </div>

        <div className="intiveBox boxBorder">
          <div>{t("邀请链接")}：</div>
          <div>{location}...</div>
          <img
            src={copy}
            alt=""
            onClick={() => {
              copyAction();
            }}
          />
        </div>
        <div className="title-option">
          <div
            className={`${tabIndex == 1 ? "tab-active" : ""}`}
            onClick={() => {
              tabChange(1);
            }}
          >
            {t("团队列表")}
          </div>
          {/* <div
            className={`tab-left ${tabIndex == 2 ? "tab-active" : ""}`}
            onClick={() => {
              tabChange(2);
            }}
          >
            {t("33社区")}
          </div> */}
        </div>
        <div className="tabTltle">
          <div>{t("钱包地址")}</div>
          <div>{t("加入时间")}</div>
          <div>{t("业绩")}</div>
        </div>
        <div className="list-box">
          {list.length == 0 ? (
            <Empty />
          ) : (
            list.map((e, index) => {
              return (
                <div className="contentList" key={index}>
                  <div>
                    <div className="imgBox">
                      <img src={wallet} alt="" />
                    </div>
                    <span>{SubAddress(e.address)}</span>
                  </div>
                  <div>
                    {formatDate(e.createTime).date} <br></br>
                    {formatDate(e.createTime).time}
                  </div>
                  <div>{fromWei(e.teamPerf)}</div>
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
      </div>
    </>
  );
};

export default MyTeam;
