import './index.scss'
import React from 'react'
import copy from '@/assets/img/copy.png'
import wallet from '@/assets/img/wallet.png'
import { Button } from "antd-mobile";

const MyTeam: React.FC = () => {
    return (
        <>
            <div style={{padding: '0 16px',background:'#03022c',minHeight:'100vh'}}>
              <div className='teamInfo'>
                <div> <span>团队人数</span> <span>直推人数</span> </div>
                <div> <span>180</span> <span>156</span> </div>
                <div> <span>团队业绩</span> <span>小区业绩</span> </div>
                <div> <span>908,890.00 CA</span> <span>23,890.56 CA</span> </div>
              </div>
              <div className='awardButton'>
                <div className='record boxBorder'>
                  <div>团队业绩记录</div>
                  <div>1,280.00</div>
                  <Button>记录</Button>
                </div>
                <div className='record boxBorder'>
                  <div>团队业绩记录</div>
                  <div>1,280.00</div>
                  <Button>记录</Button>
                </div>
              </div>
              <div className='intiveBox boxBorder'>
                <div>邀请链接：</div>
                <div>www.cloudai.io/home/user008856…</div>
                <img src={copy} alt="" />
              </div>
              <div className='title'>团队列表</div>
              <div className='tabTltle'>
                <div>钱包地址</div>
                <div>加入时间</div>
                <div>业绩(CA)</div>
              </div>
              {[1,2,3,4].map((e)=>{
                return <div className='contentList' key={e}>
                          <div>
                            <div className='imgBox'><img src={wallet} alt="" /></div>
                            <span>0x0e8…dE396</span>
                          </div>
                          <div>04/25/2025 <br></br> 18:25:56</div>
                          <div>25630.00</div>
                        </div>
              })}
            </div>
        </>
    )
}

export default MyTeam;