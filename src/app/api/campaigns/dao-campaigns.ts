import { decodeAndGunzip, gzipAndEncode } from "@/app/_lib/gzip";
import {
  Campaign,
  CampaignPK,
  UserPK,
  initCampaign,
} from "@/app/api/users/db-uc-types";
import dynamoDB from "@/utils/aws";
import { TABLE_USERS_CAMPAIGNS } from "@/app/api/api-constants";
import { getSession } from "@auth0/nextjs-auth0";
import { getUser } from "../users/dao-users";
import { APIResponse } from "../db-types";

export async function putCampaign(campaign: Campaign) {
  console.log(`putCampaign`, campaign);
  if (!campaign.pk) return false;
  const putParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Item: {
      pk: campaign.pk,
      data: await gzipAndEncode(JSON.stringify(campaign.data)),
    },
  };
  await dynamoDB.put(putParams).promise();
  return true;
}

export async function getCampaign(pk: CampaignPK): Promise<Campaign | null> {
  const fetchResult = await dynamoDB
    .get({
      TableName: TABLE_USERS_CAMPAIGNS,
      Key: {
        pk,
      },
    })
    .promise();
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
  console.log(`getCampaign`, campaign);
  return campaign;
}

export async function getCampaigns(pks: CampaignPK[]): Promise<Campaign[]> {
  const fetchResult = await dynamoDB
    .batchGet({
      RequestItems: {
        [TABLE_USERS_CAMPAIGNS]: {
          Keys: pks.map((pk) => ({ pk })),
        },
      },
    })
    .promise();
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
  console.log(`getCampaigns`, nonNullCampaigns);
  return nonNullCampaigns;
}

interface CampaignsResponse extends APIResponse {
  data: Campaign[] | null;
}

export async function getCampaignsForUser(
  userPK?: UserPK
): Promise<CampaignsResponse> {
  // if user is not provided, get campaigns for the current user
  if (!userPK) {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }
    userPK = session.user.userPK;
  }
  userPK = userPK as UserPK;

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
  return {
    success: true,
    message: "Campaigns found",
    data: campaigns,
  };
}
export async function deleteCampaign(pk: string) {
  console.log(`deleteCampaign`, pk);
  const deleteParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Key: {
      pk,
    },
  };
  await dynamoDB.delete(deleteParams).promise();
  return true;
}
