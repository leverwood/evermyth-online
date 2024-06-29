import { DataBlobRaw } from "@/app/_data/db-types";
import { ObjectLookup } from "@/app/_data/db-object-types";
import { UserProfile } from "@auth0/nextjs-auth0/client";

export type Email = string;
export type UserPK = string;
export type CampaignPK = string;

interface UsersCampaignsCommon<T extends DataBlobRaw = DataBlobRaw> {
  pk: UserPK | CampaignPK;
  data: T;
}

export interface User
  extends UsersCampaignsCommon<{
    type: "user";
    email: Email;
    isSuperuser: boolean;
    campaigns: CampaignPK[];
  }> {
  pk: UserPK;
}

export interface Campaign
  extends UsersCampaignsCommon<{
    type: "campaign";
    name: string;
    owner: UserPK;
    rewards: ObjectLookup[];
    pcs: ObjectLookup[];
    creatures: ObjectLookup[];
    shops: ObjectLookup[];
    notes: ObjectLookup[];
  }> {
  pk: CampaignPK;
}

export function isUserPK(pk: string): pk is UserPK {
  return !!pk && !pk.includes("/");
}

export function isCampaignPK(pk: string): pk is CampaignPK {
  return !!pk && pk.split("/").length === 2;
}

export function isUser(obj: any): obj is User {
  return typeof obj.pk === "string" && obj.data && obj.data.type === "user";
}

export function isCampaign(obj: any): obj is Campaign {
  return obj.pk && obj.data && obj.data.type === "campaign";
}

export function initCampaign(obj: unknown): Campaign {
  const BLANK_CAMPAIGN: Campaign = {
    pk: "",
    data: {
      type: "campaign",
      name: "",
      owner: "",
      rewards: [],
      pcs: [],
      creatures: [],
      shops: [],
      notes: [],
    },
  };
  if (typeof obj !== "object" || !obj) {
    return BLANK_CAMPAIGN;
  }
  const input = obj as any;
  return {
    pk: input.pk || "",
    data:
      typeof input.data === "object"
        ? {
            type: "campaign",
            name: input.data.name || "",
            owner: input.data.owner || "",
            rewards: input.data.rewards || [],
            pcs: input.data.pcs || [],
            creatures: input.data.creatures || [],
            shops: input.data.shops || [],
            notes: input.data.notes || [],
          }
        : {
            ...BLANK_CAMPAIGN.data,
          },
  };
}

export interface SubUserPK {
  sub: string;
  userPK: UserPK;
}

const NEW_USER: User = {
  pk: "",
  data: {
    type: "user",
    isSuperuser: false,
    email: "",
    campaigns: [],
  },
};

interface PartialUser extends Partial<Omit<User, "data">> {
  data?: Partial<User["data"]>;
}

export const initUser = (obj: unknown): User => {
  if (typeof obj !== "object" || !obj) {
    return { ...NEW_USER };
  }
  const input = obj as any;
  return {
    pk: input.pk || "",
    data: {
      type: "user",
      email: input.data.email || "",
      isSuperuser: input.data.isSuperuser || false,
      campaigns: input.data.campaigns || [],
    },
  };
};

export interface UserSession extends UserProfile {
  userPK: UserPK;
}
