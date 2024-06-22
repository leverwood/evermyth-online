import { ObjectLookup } from "./db-object-types";
import { DataBlobRaw } from "./db-types";

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
  return !pk.includes("/");
}

export function isCampaignPK(pk: string): pk is CampaignPK {
  return pk.split("/").length === 2;
}

export function isUser(obj: any): obj is User {
  return obj.data.type === "user";
}

export function isCampaign(obj: any): obj is Campaign {
  return obj.data.type === "campaign";
}
