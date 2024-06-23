import dynamoDB from "@/utils/aws";
import { TABLE_SUB_USER, TABLE_USERS_CAMPAIGNS } from "./api-constants";
import {
  Campaign,
  CampaignPK,
  SubUserPK,
  User,
  UserPK,
  initCampaign,
  initUser,
  isCampaign,
  isUser,
} from "./users/db-uc-types";
import { ObjectPK, Object } from "./objects/db-object-types";
import { decodeAndGunzip, gzipAndEncode } from "../_lib/gzip";

export async function putSubUserMap(subUser: SubUserPK) {
  console.log(`putSubUserMap`, subUser);
  if (!subUser.sub) {
    throw new Error("No sub provided");
  }
  const putParams = {
    TableName: TABLE_SUB_USER,
    Item: subUser,
  };
  await dynamoDB.put(putParams).promise();

  return true;
}

export async function getSubUser(sub: string): Promise<SubUserPK> {
  const fetchResult = await dynamoDB
    .get({
      TableName: TABLE_SUB_USER,
      Key: {
        sub,
      },
    })
    .promise();
  const subUser = fetchResult.Item as SubUserPK;
  console.log(`getSubUser`, subUser);
  return subUser;
}

export async function deleteSubUser(sub: string) {
  console.log(`deleteSubUser`, sub);
  await dynamoDB
    .delete({
      TableName: TABLE_SUB_USER,
      Key: {
        sub,
      },
    })
    .promise();
}

export async function putUser(user: User) {
  console.log(`putUser`, user);
  if (!user.pk) {
    throw new Error("No pk provided");
  }
  const putParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Item: {
      pk: user.pk,
      data: await gzipAndEncode(JSON.stringify(user.data)),
    },
  };
  const result = await dynamoDB.put(putParams).promise();
  return true;
}

export async function getUser(pk: UserPK): Promise<User | null> {
  const fetchResult = await dynamoDB
    .get({
      TableName: TABLE_USERS_CAMPAIGNS,
      Key: {
        pk,
      },
    })
    .promise();
  if (!fetchResult.Item) return null;
  let rawData: any = {};
  try {
    const rawDataStr =
      fetchResult.Item?.data && typeof fetchResult.Item?.data === "string"
        ? await decodeAndGunzip(fetchResult.Item?.data)
        : "{}";
    rawData = JSON.parse(rawDataStr);
  } catch (e) {
    console.error(`Couldn't parse user data`);
  }
  const user = initUser({
    pk,
    data: rawData,
  });
  console.log(`getUser`, user);
  return user;
}

export async function deleteUser(pk: UserPK) {
  console.log(`deleteUser`, pk);
  const deleteParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Key: {
      pk,
    },
  };
  await dynamoDB.delete(deleteParams).promise();
  return true;
}

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

export async function putObject(object: Object) {
  console.log(`putObject`, object);
  if (!object.pk || !object.campaign) {
    throw new Error("No pk or campaign provided");
  }
  const putParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Item: {
      pk: object.pk,
      campaign: object.campaign,
      data: await gzipAndEncode(JSON.stringify(object.data)),
    },
  };
  await dynamoDB.put(putParams).promise();
  return true;
}

export async function getObject(
  pk: ObjectPK,
  campaign: CampaignPK
): Promise<Object | null> {
  const fetchResult = await dynamoDB
    .get({
      TableName: TABLE_USERS_CAMPAIGNS,
      Key: {
        pk,
        campaign,
      },
    })
    .promise();
  if (!fetchResult.Item) return null;
  const rawData =
    fetchResult.Item?.data && typeof fetchResult.Item?.data === "string"
      ? await decodeAndGunzip(fetchResult.Item?.data)
      : "{}";

  // TODO: init object
  const object = {
    pk,
    campaign,
    data: JSON.parse(rawData),
  } as Object;
  console.log(`getObject`, object);
  return object;
}

export async function deleteObject(pk: ObjectPK, campaign: CampaignPK) {
  console.log(`deleteObject`, pk, campaign);
  const deleteParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Key: {
      pk,
      campaign,
    },
  };
  await dynamoDB.delete(deleteParams).promise();
  return true;
}
