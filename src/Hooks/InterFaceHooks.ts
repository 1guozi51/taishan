// 📁 src/types/user.ts

import { BigNumber } from "ethers"; // 如果你用 ethers.js

export interface UserInfo {
  activate: string | null;
  address: string | null;
  caBalance: number | null;
  caReward: number | null;
  communityPerf: number | null;
  createTime: string | null;
  directCount: number | null;
  directTotalCount: number | null;
  inviterAddress: string | null;
  layer: number | null;
  nodeLevel: number | null;
  parentAddress: string | null;
  selfInvest: number | null;
  sort: number | null;
  teamCount: number | null;
  teamNodePerf: number | null;
  teamPerf: number | null;
  teamReward: number | null;
  usdtBalance: number | null;
  userLevel: number | null;
}

export interface UserInfoAbi {
  inviter: string;
  directCount: BigNumber;
  preAmount: BigNumber;
  preIndex: BigNumber;
  gasAmount: BigNumber;
  profitQuota: BigNumber;
  ticketNumber: BigNumber;
}

