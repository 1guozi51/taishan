import './index.scss'
import React from 'react'
import BackHeader from '@/components/BackHeader'
import NoData from '@/components/NoData'

const AssetRecords: React.FC = () => {
    return (
        <>
            <BackHeader title='USDT记录' rightText='CA记录' />
            <div className='records-page'>
                <div className="records-tab">
                    <div className="records-item active">提现记录</div>
                    <div className="records-item">充值记录</div>
                </div>
                <div className='records-list'>
                    <div className="record-head">
                        <span>时间</span>
                        <span>状态</span>
                        <span>数量</span>
                    </div>
                    <div className='record-body'>
                        {
                            [1, 2, 3, 4].map((record, index) => {
                                return (
                                    <div className='record-item' key={index}>
                                        <span>2025-09-05 18:32:56</span>
                                        <span>确认中 2/5</span>
                                        <span>-1000.00</span>
                                    </div>
                                )
                            })
                        }
                        <NoData/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssetRecords;