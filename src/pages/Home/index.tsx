import './index.scss'
import React from 'react'
import { useNavigate } from "react-router-dom"
import Header from '@/components/Header'

import homeBg from '@/assets/img/home-bg.png'
import soulNode from '@/assets/img/soul-node.png'
import union from '@/assets/img/union.png'
import homeTickets from '@/assets/img/home-tickets.png'
import homeSwap from '@/assets/img/home-swap.png'
import homeZc from '@/assets/img/home-zc.png'
import homeNode from '@/assets/img/home-node.png'
import star from '@/assets/img/star.png'
import aboutToken from '@/assets/img/about-token.png'
import proportion from '@/assets/img/token-proportion.png'


const HomeTitle: React.FC<{
    className?: string,
    text1: string,
    text2: string
}> = ({ className, text1, text2 }) => {
    return (
        <div className={`home-title ${className}`}>
            <div className='text1'>
                <img src={star} className='star-img' alt="" />
                <span>{text1}</span>
            </div>
            <div className='text2'>{text2}</div>
        </div>
    )
}


const Home: React.FC = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="home-page">
                <Header showLogo showConnect />
                <div className='project-info'>
                    <img src={homeBg} className='home-bg' alt="" />
                    <div className='project-content'>
                        <img src={soulNode} className='soul-node' alt="" />
                        <div className='ai-network'>
                            全球多场景AI分布式推理网络
                        </div>
                        <div className='effect'>
                            <div className='effect-text1'>连接游戏 · 娱乐 · 金融的算力高速公路</div>
                            <img src={union} className='union-img' alt="" />
                            <div className='effect-text2'>让每个人都能参与AI时代的收益分配</div>
                        </div>
                        <div className='home-tab'>
                            <div className="tab-item">
                                <img src={homeTickets} className='tab-icon' alt="" />
                                <span>门票</span>
                            </div>
                            <div onClick={()=>navigate('/swap')} className="tab-item">
                                <img src={homeSwap} className='tab-icon' alt="" />
                                <span>交易</span>
                            </div>
                            <div onClick={()=>navigate('/crowd')} className="tab-item">
                                <img src={homeZc} className='tab-icon' alt="" />
                                <span>众筹</span>
                            </div>
                            <div className="tab-item">
                                <img src={homeNode} className='tab-icon' alt="" />
                                <span>节点</span>
                            </div>
                        </div>
                    </div>
                </div>
                <HomeTitle
                    className='about-token'
                    text1='关于Token'
                    text2='CA Token用于CloudAi整个生态的流通'
                />
                <img src={aboutToken} className='about-token-img' alt="" />

                <div className="token-info">
                    <div className='token-row'>
                        <span className='key'>Token名称：</span>
                        <span className='val'>CloudAi（简称：CA）</span>
                    </div>
                    <div className='token-row'>
                        <span className='key'>发行总量：</span>
                        <span className='val'>21亿枚</span>
                    </div>
                    <div className='proportion-box'>
                        <img src={proportion} className='proportion-img' alt="" />
                        <div className='proportion-item left'>
                            <div className='label'>Swap</div>
                            <div className='num'>2100万枚</div>
                        </div>
                        <div className='proportion-item center'>
                            <div className='label'>Swap</div>
                            <div className='num'>2100万枚</div>
                        </div>
                        <div className='proportion-item right'>
                            <div className='label'>Swap</div>
                            <div className='num'>2100万枚</div>
                        </div>
                    </div>
                </div>

                <HomeTitle
                    text1='排行榜'
                    text2='参与CloudAi生态的TOP10榜单'
                />

                <div className='rank-box'>
                    <div className="rank-tab">
                        <div className="tab-item active">投资榜</div>
                        <div className="tab-item">爆仓榜</div>
                        <div className="tab-item">推荐榜</div>
                    </div>
                    <div className='top3-info'>
                        <div className="top3-box top1">
                            <span className='amount'>1,205,000</span>
                            <span className='unit'>USDT</span>
                            <span className='address'>0x0e8…dE903</span>
                        </div>
                        <div className="top3-box top2">
                            <span className='amount'>1,205,000</span>
                            <span className='unit'>USDT</span>
                            <span className='address'>0x0e8…dE903</span>
                        </div>
                        <div className="top3-box top3">
                            <span className='amount'>1,205,000</span>
                            <span className='unit'>USDT</span>
                            <span className='address'>0x0e8…dE903</span>
                        </div>
                    </div>
                    <div className='rank-list'>
                        <div className="rank-head">
                            <span>排名</span>
                            <span>用户</span>
                            <span>总投资</span>
                        </div>
                        <div className="rank-body">
                            {
                                [1, 2, 3, 4, 5, 9, 6, 7, 8, 10].map((rank, index) => {
                                    return (
                                        <div className='rank-item'>
                                            <span>{index + 4}</span>
                                            <span>0x0e80d…dE396</span>
                                            <span>922,389.00 USDT</span>
                                        </div>
                                    )
                                })

                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;