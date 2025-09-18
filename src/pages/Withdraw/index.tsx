import './index.scss'
import React from 'react'
import {Input,Button} from 'antd-mobile'
import BackHeader from '@/components/BackHeader'

const Withdraw: React.FC = () => {
    return (
        <>
            <BackHeader title='资产提现' rightText='提现记录' />

            <div className='withdraw-page'>
                <div className="assets-title">
                    资产类型
                </div>
                <div className="type-tab">
                    <div className='type-item active'>USDT</div>
                    <div className='type-item'>CA</div>
                </div>
                <div className='balance-box'>
                    <span>提现数量</span>
                    <span>账户余额：32,800.56</span>
                </div>
                <div className='withdraw-num'>
                    <Input className='withdraw-input' type='number' placeholder='0.00' />
                    <div className="unit">USDT</div>
                </div>
                <div className="gas-box">
                    <div className="key">手续费（0.03%）：</div>
                    <div className="val">0.00 USDT</div>
                </div>
                <div className="get-box">
                    <div className="key">实际到账：</div>
                    <div className="val">100.00 USDT</div>
                </div>
                <Button className='confirm-btn withdraw-btn'>确认提现</Button>
            </div>
        </>
    )
}

export default Withdraw;