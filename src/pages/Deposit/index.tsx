import './index.scss'
import React from 'react'
import {Input,Button} from 'antd-mobile'
import BackHeader from '@/components/BackHeader'

const Deposit: React.FC = () => {
    return (
        <>
            <BackHeader title='资产充值' rightText='充值记录' />

            <div className='deposit-page'>
                <div className="assets-title">
                    资产类型
                </div>
                <div className="type-tab">
                    <div className='type-item active'>USDT</div>
                    <div className='type-item'>CA</div>
                </div>
                <div className='balance-box'>
                    <span>充值数量</span>
                    <span>账户余额：32,800.56</span>
                </div>
                <div className='deposit-num'>
                    <Input className='deposit-input' type='number' placeholder='0.00' />
                    <div className="unit">USDT</div>
                </div>
                <div className='amount-list'>
                    <div className='amount-item active'>100</div>
                    <div className='amount-item'>200</div>
                    <div className='amount-item'>300</div>
                    <div className='amount-item'>500</div>
                    <div className='amount-item'>1000</div>
                    <div className='amount-item'>2000</div>
                </div>
                <div className="gas-box">
                    <div className="key">手续费（0.00%）：</div>
                    <div className="val">0.00 USDT</div>
                </div>
                <div className="get-box">
                    <div className="key">实际到账：</div>
                    <div className="val">100.00 USDT</div>
                </div>
                <Button className='confirm-btn deposit-btn'>确认充值</Button>
            </div>
        </>
    )
}

export default Deposit;