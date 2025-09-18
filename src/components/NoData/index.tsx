import './index.scss'
import React from 'react'

import noData from '@/assets/img/no-data.png'

const NoData: React.FC = () => {
    return (
        <div className='no-data'>
            <img src={noData} alt="" />
            <span>暂无数据</span>
        </div>
    )
}

export default NoData;