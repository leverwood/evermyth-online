import { UserPK } from "./db-uc-types";

export type RewardPK = string;
export interface Reward {
  pk: RewardPK;
  userPK: UserPK;
  type: "reward";
  data: {
    name: string;
  };
}

export function initReward(obj: unknown): Reward {
  const BLANK_CAMPAIGN: Reward = {
    pk: "",
    userPK: "",
    type: "reward",
    data: {
      name: "",
    },
  };
  if (typeof obj !== "object" || !obj) {
    return BLANK_CAMPAIGN;
  }
  const input = obj as any;
  return {
    pk: input.pk || "",
    type: "reward",
    userPK: input.userPK || "",
    data:
      typeof input.data === "object"
        ? {
            name: input.data.name || "",
          }
        : {
            ...BLANK_CAMPAIGN.data,
          },
  };
}
