import { t } from "i18next";
import nodeImg from "@/assets/img/nodeImg.png";
import nodeImg1 from "@/assets/img/nodeImg1.png";
import nodeImg2 from "@/assets/img/nodeImg2.png";
import nodeImg3 from "@/assets/img/nodeImg3.png";
export const nodeList = [
  {
    id: 0,
    value: "0",
    nodeImg: nodeImg,
    name: t("社区节点"),
    list: [
      t("全网购买门票的5%均分大超级节点"),
      t("30000U矿机放大4倍12万U额度"),
      t("全网动静产币均分2%"),
      t("全网众筹静态10%产出总额2%"),
      t("获得F7会员等级(限时3个月)"),
    ],
  },
  {
    id: 1,
    value: "4",
    nodeImg: nodeImg,
    name: t("社区节点"),
    list: [
      t("全网购买门票的5%均分大超级节点"),
      t("30000U矿机放大4倍12万U额度"),
      t("全网动静产币均分2%"),
      t("全网众筹静态10%产出总额2%"),
      t("获得F7会员等级(限时3个月)"),
    ],
  },
  {
    id: 2,
    value: "3",
    nodeImg: nodeImg1,
    name: t("超级节点"),
    list: [
      t("3000U矿机放大3倍10000U矿机放大3倍3万U额度"),
      t("全网动静产币均分2%"),
      t("全网众筹静态10%产出总额x 1%"),
      t("获得F6会员等级(限时3个月)"),
    ],
  },
  {
    id: 3,
    value: "2",
    nodeImg: nodeImg2,
    name: t("大节点"),
    list: [
      t("3000U矿机放大3倍9000U额度"),
      t("全网动静产币均分2%"),
      t("全网众筹静态10%产出总额x 1%"),
      t("获得F4会员等级(限时3个月)"),
    ],
  },
  {
    id: 4,
    nodeImg: nodeImg3,
    value: "1",
    name: t("小节点"),
    list: [
      t("500U矿机放大3倍1500U额度"),
      t("全网动静产币均分3%"),
      t("全网众筹静态10%产出总额x 1%"),
      t("获得F2会员等级(限时3个月)"),
    ],
  },
];

export const nodeBuyList = [
  {
    id: 0,
    value: "3",
    nodeImg: nodeImg1,
    name: t("超级节点"),
    balance: 0, //剩余数量
    price: 11000,
    number: 50,
    list: [
      t("3000U矿机放大3倍10000U矿机放大3倍3万U额度"),
      t("全网动静产币均分2%"),
      t("全网众筹静态10%产出总额x 1%"),
      t("获得F6会员等级(限时3个月)"),
    ],
  },
  {
    id: 1,
    balance: 0, //剩余数量
    value: "2",
    nodeImg: nodeImg2,
    name: t("大节点"),
    price: 3300,
    number: 500,
    list: [
      t("3000U矿机放大3倍9000U额度"),
      t("全网动静产币均分2%"),
      t("全网众筹静态10%产出总额x 1%"),
      t("获得F4会员等级(限时3个月)"),
    ],
  },
  {
    id: 2,
    balance: 0, //剩余数量
    nodeImg: nodeImg3,
    value: "1",
    name: t("小节点"),
    price: 550,
    number: 5000,
    list: [
      t("500U矿机放大3倍1500U额度"),
      t("全网动静产币均分3%"),
      t("全网众筹静态10%产出总额x 1%"),
      t("获得F2会员等级(限时3个月)"),
    ],
  },
];

export default {
  nodeList,
  nodeBuyList,
};
