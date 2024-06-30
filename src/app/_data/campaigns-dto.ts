import { decodeAndGunzip, gzipAndEncode } from "@/app/_lib/gzip";
import {
  Campaign,
  CampaignPK,
  UserPK,
  initCampaign,
} from "@/app/_data/db-uc-types";
import dynamoDB from "@/utils/aws";
import { TABLE_USERS_CAMPAIGNS } from "@/app/api/api-constants";
import { getSession } from "@auth0/nextjs-auth0";
import { getUser, putUser } from "@/app/_data/user-dto";
import { APIResponse } from "@/app/_data/db-types";

import NodeCache from "node-cache";
const campaignsCache = new NodeCache();

export async function putCampaign(campaign: Campaign) {
  console.log(`putCampaign`, campaign);
  if (!campaign.pk) return false;
  const userPK = campaign.pk.split("/")[0];
  const user = await getUser(userPK);
  if (!user) return false;

  if (user.pk !== userPK) return false;

  campaignsCache.del(`${userPK}-campaigns`);
  campaignsCache.del(`${campaign.pk}`);
  const putParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Item: {
      pk: campaign.pk,
      data: await gzipAndEncode(JSON.stringify(campaign.data)),
    },
  };
  await dynamoDB.put(putParams);
  return true;
}

export async function getCampaign(pk: CampaignPK): Promise<Campaign | null> {
  if (campaignsCache.has(`${pk}`)) {
    console.log(`getCampaign from cache`, pk);
    return campaignsCache.get(`${pk}`) as Campaign;
  }
  const fetchResult = await dynamoDB.get({
    TableName: TABLE_USERS_CAMPAIGNS,
    Key: {
      pk,
    },
  });
  if (!fetchResult.Item) return null;
  const dataStr =
    fetchResult.Item?.data && typeof fetchResult.Item?.data === "string"
      ? await decodeAndGunzip(fetchResult.Item?.data)
      : "{}";
  const dataObj = JSON.parse(dataStr);
  const campaign = initCampaign({
    pk,
    data: dataObj,
  });
  campaignsCache.set(`${pk}`, campaign);
  console.log(`getCampaign`, campaign);
  return campaign;
}

export const getCampaigns = async (pks: CampaignPK[]): Promise<Campaign[]> => {
  const fetchResult = await dynamoDB.batchGet({
    RequestItems: {
      [TABLE_USERS_CAMPAIGNS]: {
        Keys: pks.map((pk) => ({ pk })),
      },
    },
  });
  if (!fetchResult.Responses) return [];

  const campaigns = await Promise.all(
    fetchResult.Responses[TABLE_USERS_CAMPAIGNS].map(async (item) => {
      // format doesn't match
      const rawData =
        item.data && typeof item.data === "string"
          ? await decodeAndGunzip(item.data)
          : "{}";
      const dataObj = JSON.parse(rawData);
      return initCampaign({
        pk: item.pk,
        data: dataObj,
      });
    })
  );

  const nonNullCampaigns = campaigns.filter(
    (campaign) => campaign !== null
  ) as Campaign[];

  return nonNullCampaigns;
};

export interface CampaignsResponse extends APIResponse {
  data: Campaign[] | null;
}

export const getCampaignsForUser = async (
  userPK?: UserPK
): Promise<CampaignsResponse> => {
  // if user is not provided, get campaigns for the current user
  if (!userPK) {
    const session = await getSession();
    if (!session || !session.user.userPK) {
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }
    userPK = session.user.userPK;
  }
  userPK = userPK as UserPK;

  if (userPK && campaignsCache.has(`${userPK}-campaigns`)) {
    console.log(`getCampaignsForUser from cache`, userPK);
    return {
      message: "Campaigns found",
      success: true,
      data: campaignsCache.get(`${userPK}-campaigns`) as Campaign[],
    };
  }

  const user = await getUser(userPK);
  if (!user) {
    return {
      message: "User not found",
      success: false,
      data: null,
    };
  }
  if (!user.data.campaigns || user.data.campaigns.length === 0) {
    return {
      success: true,
      message: "No campaigns found",
      data: [],
    };
  }
  const campaigns = await getCampaigns(user.data.campaigns);
  campaignsCache.set(`${userPK}-campaigns`, campaigns);
  return {
    success: true,
    message: "Campaigns found",
    data: campaigns,
  };
};
export async function deleteCampaignDTO(pk: string) {
  const user = await getUser(pk.split("/")[0]);

  if (!user) {
    return false;
  }

  // check it matches the session
  const session = await getSession();
  if (!session || !session.user.userPK) {
    return false;
  }
  if (session.user.userPK !== user.pk) {
    return false;
  }

  console.log(`deleteCampaign`, pk);
  campaignsCache.del(`${pk}`);
  const deleteParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Key: {
      pk,
    },
  };
  try {
    await dynamoDB.delete(deleteParams);
  } catch (e) {
    console.error(`Couldn't delete campaign ${pk}`, e);
    return false;
  }

  // update user
  user.data.campaigns = user.data.campaigns.filter(
    (campaignPK) => campaignPK !== pk
  );
  try {
    await putUser(user);
  } catch (e) {
    console.error(`Couldn't update user ${user.pk}`, e);
    return false;
  }

  return true;
}
