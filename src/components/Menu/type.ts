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
export const defaultUserInfo: Required<Record<keyof UserInfo, any>> = {
  activate: '',
  address: '',
  caBalance: 0,
  caReward: 0,
  communityPerf: 0,
  createTime: '',
  directCount: 0,
  directTotalCount: 0,
  inviterAddress: '',
  layer: 0,
  nodeLevel: 0,
  parentAddress: '',
  selfInvest: 0,
  sort: 0,
  teamCount: 0,
  teamNodePerf: 0,
  teamPerf: 0,
  teamReward: 0,
  usdtBalance: 0,
  userLevel: 0,
};

export const fillNullWithDefault = <T extends Record<string, any>>(
  data: Partial<T>,
  defaults: T
): T => {
  return Object.keys(defaults).reduce((acc, key) => {
    const k = key as keyof T;
    acc[k] = data[k] ?? defaults[k];
    return acc;
  }, {} as T);
};