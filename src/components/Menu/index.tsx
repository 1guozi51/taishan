import './index.scss'
import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import close from '@/assets/img/close.png'
import wallet from '@/assets/img/wallet.png'
import node from '@/assets/img/node-level.png'
import member from '@/assets/img/member-level.png'
import hide from '@/assets/img/hide-assets.png'
import more from '@/assets/img/more.png'

interface MenuType {
    label: string,
    url: string
}

const menuList: MenuType[] = [
    { label: "首页", url: "/" },
    { label: "门票记录", url: "" },
    { label: "我的众筹", url: "/crowd" },
    { label: "我的矿机", url: "" },
    { label: "Swap", url: "/swap" },
    { label: "我的节点", url: "/myNode" },
    { label: "我的团队", url: "/myTeam" },
];


const Menu: React.FC<{
    visible: boolean,
    onClose: () => void
}> = ({ visible, onClose }) => {

    const navigate = useNavigate();

    const handleClick = (url: string) => {
        if (url) {
            onClose();
            setTimeout(() => { navigate(url); }, 200)
        }
    };

    useEffect(() => {
        document.body.style.overflow = visible ? "hidden" : "";
    }, [visible])

    return (
        <>
            <div className={`menu-content ${visible ? 'show' : 'hide'}`}>
                <div className='connect-info'>
                    <img onClick={onClose} src={close} className='close-img' alt="" />
                    <div className="wallet-box">
                        <img src={wallet} className='wallet-img' alt="" />
                    </div>
                    <div className='address'>
                        0x0e8…dE396
                    </div>
                    <div className='node-box'>
                        <img src={node} className='node-img' alt="" />
                        <span>超级节点</span>
                    </div>
                    <div className='member-box'>
                        <img src={member} className='member-img' alt="" />
                        <span>F6</span>
                    </div>
                </div>
                <div className='menu-info'>
                    <div className="assets-info">
                        <div className='assets-title'>
                            <span>我的资产</span>
                            <img src={hide} className='status-img' alt="" />
                        </div>
                        <div className='balance-box'>
                            <div className='balance-item'>
                                <div className="balance-key">
                                    <span>USDT余额</span>
                                    <img src={more} className='more-img' alt="" />
                                </div>
                                <div className='balance-val'>
                                    32,800.56
                                </div>
                            </div>
                            <div className='balance-item'>
                                <div className="balance-key">
                                    <span>CA余额</span>
                                    <img src={more} className='more-img' alt="" />
                                </div>
                                <div className='balance-val'>
                                    32,800.56
                                </div>
                            </div>
                        </div>
                        <div className="btn-list">
                            <div onClick={() => navigate('/deposit')} className='btn cz-btn'>
                                充值
                            </div>
                            <div onClick={() => navigate('/withdraw')} className='btn tx-btn'>
                                提现
                            </div>
                        </div>
                    </div>
                    <div className='gas-balance'>
                        <div className='gas'>GAS余额：100</div>
                        <div>
                            <span className='link-text'>明细记录</span>
                            <span className='link-text'>去获取</span>
                        </div>
                    </div>
                    {
                        menuList.map((menu, index) => {
                            return (
                                <div className='menu-item' key={index} onClick={() => handleClick(menu.url)}>
                                    <span>{menu.label}</span>
                                    <img src={more} className='more-img' alt="" />
                                </div>
                            )
                        })
                    }

                    <div className="disconnect-box">
                        断开绑定钱包
                    </div>

                </div>

            </div>
        </>
    )
}

export default Menu;