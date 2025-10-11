import { lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { ensureWalletConnected } from "@/Hooks/WalletHooks.ts";

import { userAddress } from "@/Store/Store.ts";
import {Spin } from "antd";

const Home = lazy(() => import("@/pages/Home/index.tsx"));
const Deposit = lazy(() => import("@/pages/Deposit/index.tsx"));
const Withdraw = lazy(() => import("@/pages/Withdraw/index.tsx"));
const AssetRecords = lazy(() => import("@/pages/AssetRecords/index.tsx"));
const Swap = lazy(() => import("@/pages/Swap/index.tsx"));
const Crowd = lazy(() => import("@/pages/Crowd/index.tsx"));
const MyTeam = lazy(() => import("@/pages/MyTeam/index.tsx"));
const MyNode = lazy(() => import("@/pages/MyNode/index.tsx"));
const Node = lazy(() => import("@/pages/Node/index.tsx"));
const RecordList = lazy(() => import("@/pages/recordList/index.tsx"));
function App() {
  console.log("app==");
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    async function fetchWallet() {
      const address = await userAddress().address; // 异步获取钱包地址
      if(!address){
          ensureWalletConnected();
      }
      setWalletAddress(address);
      setLoading(false);
    }
    fetchWallet();
  }, []);

 const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="loading">
        <Spin />
      </div>
    );
  }
  return (
    <>
      {wallertAddress ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/asset-records" element={<AssetRecords />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/crowd" element={<Crowd />} />
          <Route path="/myTeam" element={<MyTeam />} />
          <Route path="/myNode" element={<MyNode />} />
          <Route path="/node" element={<Node />} />
          <Route path="/recordList" element={<RecordList />} />
        </Routes>
      ) : (
        <div className="loding">
           <Route path="*" element={<div>请先连接钱包</div>} />
        </div>
      )}
    </>
  );
}

export default App;
