import "./index.scss";
import { useState, useEffect } from "react";
import copy from "@/assets/img/copy.png";
import wallet from "@/assets/img/wallet.png";
import { Button } from "antd-mobile";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { InfiniteScroll } from "antd-mobile";
import { Spin, Empty } from "antd";
import { Totast, fromWei, SubAddress, formatDate } from "@/Hooks/Utils.ts";

const MyTeam: React.FC = () => {
  const wallertAddress = userAddress().address;
  // const userInfo = JSON.parse(localStorage.getItem("userInfo") || {});
  const [teamInfo, setTeamInfo] = useState({});
  const [location, setLocation] = useState("");
  const [list, setList] = useState([]);
  // 数据是否加载
  const [dataLoading, setDataLoading] = useState(false);
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
  const getDataList = async () => {
    setListLoding(true);
    const result = await NetworkRequest({
      Url: "user/teamChild",
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

  // 获取更多团队列表
  const loadMoreAction = async () => {
    console.log("进来了获取更多列表");
    const nexPage = dataParam.current + 1;
    setDataParam((prevState) => ({
      ...prevState,
      current: nexPage,
    }));
    await NetworkRequest({
      Url: "user/teamChild",
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
  useEffect(() => {
    getPageInfo();
    getDataList();
  }, []);
  return (
    <>
      <div
        style={{ padding: "0 16px", background: "#03022c", minHeight: "100vh" }}
      >
        <div className="teamInfo">
          <div>
            {" "}
            <span>团队人数</span> <span>直推人数</span>{" "}
          </div>
          <div>
            {" "}
            <span>{teamInfo.teamCount}</span>{" "}
            <span>{teamInfo.directCount}</span>{" "}
          </div>
          <div>
            {" "}
            <span>团队业绩</span> <span>小区业绩</span>{" "}
          </div>
          <div>
            {" "}
            <span>{fromWei(teamInfo.teamPerf)} USDT</span>{" "}
            <span>{fromWei(teamInfo.communityPerf)} USDT</span>{" "}
          </div>
        </div>
        <div className="awardButton">
          <div className="record boxBorder">
            <div>累计领取奖励(USDT)</div>
            <div>{fromWei(teamInfo.teamReward)}</div>
            <Button>记录</Button>
          </div>
          <div className="record boxBorder">
            <div>待领取奖励(USDT)</div>
            <div>{fromWei(teamInfo.teamClaimReward)}</div>
            <Button>记录</Button>
          </div>
        </div>

        <div className="awardButton">
          <div className="record boxBorder">
            <div>累计领取奖励(CA)</div>
            <div>{fromWei(teamInfo.caReward)}</div>
            <Button>记录</Button>
          </div>
          <div className="record boxBorder">
            <div>待领取奖励(CA)</div>
            <div>{fromWei(teamInfo.caClaimReward)}</div>
            <Button>记录</Button>
          </div>
        </div>

        <div className="intiveBox boxBorder">
          <div>邀请链接：</div>
          <div>{location}...</div>
          <img
            src={copy}
            alt=""
            onClick={() => {
              copyAction();
            }}
          />
        </div>
        <div className="title">团队列表</div>
        <div className="tabTltle">
          <div>钱包地址</div>
          <div>加入时间</div>
          <div>业绩(CA)</div>
        </div>
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
    </>
  );
};

export default MyTeam;
