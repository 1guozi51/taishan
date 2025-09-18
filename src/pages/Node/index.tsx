import './index.scss'
import React from 'react'
import nodeImg from '@/assets/img/nodeImg.png'
import nodeImg1 from '@/assets/img/nodeImg1.png'
import nodeImg2 from '@/assets/img/nodeImg2.png'
import nodeImg3 from '@/assets/img/nodeImg3.png'
import equityIcon from '@/assets/img/equityIcon.png'
import { useState } from "react";
import { Button } from 'antd-mobile'
import BuyNodePopup from './components/BuyNodePopup'
const MyNode: React.FC = () => {
  const [nodeState, setNodeState] = useState<boolean>(false)
  const [nodePopState, setnodePopState] = useState<boolean>(false)

  const nodeList = [
    { img: nodeImg, title: '超级黑钻节点', price:'30000', residue: '1', total: '10', equity: ['全网购买门票的5%均分给所有股东节', '30000U矿机放大4倍12万U额度，0.8%每日释放', '全网动静产币均红2%', '全网众筹静态10%产出总额x 2%', '获得F7会员等级（限时3个月）'] },
    { img: nodeImg1, title: '超级节点', price:'10000', residue: '1', total: '10', equity: ['全网购买门票的5%10000U矿机放大3倍3万U额度，0.8%每日释放', '全网动静产币均红2%', '全网众筹静态10%产出总额x 1%', '获得F6会员等级（限时3个月）'] },
    { img: nodeImg2, title: '大节点', price:'3000', residue: '12', total: '10', equity: ['3000U矿机放大3倍9000U额度，0.8%每日释放', '全网动静产币均红2%', '全网众筹静态10%产出总额x 1%', '获得F4会员等级（限时3个月）'] },
    { img: nodeImg3, title: '小节点', price:'500', residue: '0', total: '10', equity: ['500U矿机放大3倍1500U额度，0.8%每日释放', '全网动静产币均红3%', '全网众筹静态10%产出总额x 1%', '获得F2会员等级（限时3个月）'] },
  ]
  return (
    <>
      <div className='nodeBox'>
        <div className='nodeContent'>
          <div>5560</div>
          <div>CloudAi全球节点总数</div>
          <div>未售节点：1280</div>
        </div>
        {nodeList.map((e, index) => {
          return (
            <div className='nodeItem boxBorder' key={index}>
              <div className='title'>
                <img src={e.img} alt="" />
                <div> {e.title} </div>
                <div>剩余 {e.residue} </div>
                <div> <span>限量</span> <span>{e.total}个 </span></div>
              </div>
              <div className='equityBox'>
                <div className='title'>专属权益</div>
                {e.equity.map((e, index) => {
                  return (<div key={index}> <img src={equityIcon} alt="" /> {e} </div>)
                })}
              </div>
              <div className='Bottom'>
                <div> {e.price} USDT/个 </div>
                <Button className='coloursBT' onClick={()=>setnodePopState(true)} style={{width:'92px',height:'32px'}}>购买</Button>
              </div>
            </div>
          )
        })}
      </div>
      <BuyNodePopup popState={nodePopState} setPopState={() => setnodePopState(false)} setNodeState={()=> setNodeState(true)}></BuyNodePopup>
    </>
  )
}

export default MyNode;



