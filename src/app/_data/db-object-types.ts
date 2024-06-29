import { UserPK, CampaignPK } from "@/app/_data/db-uc-types";
import { DataBlobRaw } from "@/app/_data/db-types";

export type ObjectLookup = string;

export function splitObjectLookup(objectLookup: ObjectLookup): {
  userPK: UserPK;
  campaignPK: CampaignPK;
  objectPK: ObjectPK;
} {
  const [userPK, campaignPK, objectPK] = objectLookup.split("/");
  return {
    userPK,
    campaignPK,
    objectPK,
  } as const;
}

interface ObjectRawCommon<T extends DataBlobRaw = DataBlobRaw> {
  pk: ObjectPK;
  campaign: CampaignPK;
  data: T;
}

export interface Reward
  extends ObjectRawCommon<{
    type: "reward";
    name: string;
  }> {}

export interface PC
  extends ObjectRawCommon<{
    type: "pc";
    name: string;
  }> {}

export interface Creature
  extends ObjectRawCommon<{
    type: "creature";
    name: string;
  }> {}

export interface Shop
  extends ObjectRawCommon<{
    type: "shop";
    name: string;
  }> {}

export interface Note
  extends ObjectRawCommon<{
    type: "note";
    title: string;
  }> {}

export type Object = Reward | PC | Creature | Shop | Note;
export type ObjectPK = string;
