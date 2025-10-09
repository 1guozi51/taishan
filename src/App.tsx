import { lazy } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
const Home = lazy(() => import('@/pages/Home/index.tsx'));
const Deposit = lazy(() => import('@/pages/Deposit/index.tsx'));
const Withdraw = lazy(() => import('@/pages/Withdraw/index.tsx'));
const AssetRecords = lazy(() => import('@/pages/AssetRecords/index.tsx'));
const Swap = lazy(() => import('@/pages/Swap/index.tsx'));
const Crowd = lazy(() => import('@/pages/Crowd/index.tsx'));
const MyTeam = lazy(() => import('@/pages/MyTeam/index.tsx'));
const MyNode = lazy(() => import('@/pages/MyNode/index.tsx'));
const Node = lazy(() => import('@/pages/Node/index.tsx'));
console.log('Home');
function App() {
  return (
    <>
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
      </Routes>
    </>
  )
}

export default App
