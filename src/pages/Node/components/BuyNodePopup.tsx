import './index.scss'
import React from 'react'
import { Popup, Button, Modal, Mask } from 'antd-mobile'
import { useState } from "react";
import closeImg from '@/assets/img/closeImg.png'
import nodeImg from '@/assets/img/nodeImg.png'
import { useNavigate } from 'react-router-dom'
import { t } from "i18next";

const Home: React.FC<{
  popState: boolean,
  setPopState: () => void
  setNodeState: () => void
}> = ({ popState,
  setPopState,
  setNodeState
}) => {
    const navigate = useNavigate()
    return (
      <>
        <Popup
          visible={popState}
          onMaskClick={() => {
            setPopState()
          }}
          onClose={() => {
            setPopState()
          }}
          bodyStyle={{ height: '440px' }}
        >
          <div className='PopBox'>
            <div className='popTitle'>
              <div>{t('购买节点')}</div>
              <img src={closeImg} alt="" onClick={() => { setPopState() }} />
            </div>
            <div>
              <div className='payNode'><img src={nodeImg} alt="" /></div>
              <div className='price'>30000.00 USDT</div>
              <div className='balance'>钱包余额：320.00 USDT</div>
              <Button
                className="coloursBT"
                style={{ width: '100%', height: '50px' }}
                onClick={() => {
                  setPopState();
                  const handler = Modal.show({
                    title: '欢迎加入',
                    closeOnMaskClick: true,
                    bodyClassName: 'successPop',
                    content: (
                      <>
                        <div className="title2">CloudAi全球节点</div>
                        <div className="payNode">
                          <img src={nodeImg} alt="" />
                          <div className="text">获得超级黑钻节点</div>
                        </div>
                        <Button
                          className="btn coloursBT"
                          onClick={() => {
                            setPopState();
                            setNodeState();
                            handler.close();
                            navigate('/myNode')
                          }}
                        >
                          查看节点中心
                        </Button>
                      </>
                    ),
                  });
                }}
              >
                确认购买
              </Button>
            </div>
          </div>
        </Popup>
      </>
    )
  }

export default Home;