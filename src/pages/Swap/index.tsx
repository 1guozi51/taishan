import './index.scss'
import React from 'react'
import { Input, Button } from 'antd-mobile'
import Header from '@/components/Header'

import tip from '@/assets/img/swap-tip.png'
import ca from '@/assets/img/ca.png'
import usdt from '@/assets/img/usdt.png'
import toggle from '@/assets/img/toggle.png'
import more from '@/assets/img/records-more.png'

const Swap: React.FC = () => {
    return (
        <>
            <Header title="Swap" recordText='兑换记录' />
            <div className='swap-page'>
                <div className="scale-tip">
                    <img src={tip} className='tip-img' alt="" />
                    <span>兑换比例：1 USDT ≈ 102.56 CA</span>
                </div>
                <div className="select-assets">
                    选择资产
                </div>
                <div className="assets-tab">
                    <div className='assets-tab active'>账户资产</div>
                    <div className='assets-tab'>钱包资产</div>
                </div>
                <div className="from-box">
                    <div className='token-info'>
                        <div className='symbol-box'>
                            <img src={ca} alt="" />
                            <span>CA</span>
                        </div>
                        <div className='balance'>余额：1500.00</div>
                    </div>
                    <Input className='from-input' type='number' placeholder='0.00' />
                    <div className='price-text'>≈ 150.00 USDT</div>
                    <div className='scale-list'>
                        <div className='scale-item'>25%</div>
                        <div className='scale-item'>50%</div>
                        <div className='scale-item'>75%</div>
                        <div className='scale-item active'>MAX</div>
                    </div>
                </div>
                <img src={toggle} className='toggle-img' alt="" />
                <div className='to-box'>
                    <div className='token-info'>
                        <div className='symbol-box'>
                            <img src={usdt} alt="" />
                            <span>USDT</span>
                        </div>
                        <div className='balance'>余额：1500.00</div>
                    </div>
                    <div className="get-amount">150.00</div>
                </div>
                <div className="swap-data">
                    <span className='key'>兑换滑点：</span>
                    <span className='val'>3%</span>
                </div>
                <div className="swap-data">
                    <span className='key'>预计获得：</span>
                    <span className='val'>1500.56 USDT</span>
                </div>
                <div className="swap-data">
                    <span className='key'>GAS：</span>
                    <span className='val'>1500 GAS</span>
                </div>
                <div className="gas-balance">
                    <span className='balance'>GAS余额：100</span>
                    <span className="go-get">去获取</span>
                </div>
                <Button className='confirm-btn swap-btn'>兑换</Button>
                <div className='records-title'>
                    <span className='title-text'>兑换记录</span>
                    <div className='more-box'>
                        <span>全部记录</span>
                        <img src={more} alt="" />
                    </div>
                </div>
                <div className='records-head'>
                    <span>时间</span>
                    <span>交易对</span>
                    <span>状态</span>
                </div>
                {
                    [1, 2, 3, 4, 5, 5].map((record, index) => {
                        return (
                            <div className='record-item' key={index}>
                                <span>04/25/2025 18:25:56</span>
                                <span>用 1500 CA兑换 150.56 SUDT</span>
                                <span>已完成</span>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Swap;