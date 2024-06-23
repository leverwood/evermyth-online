import dynamoDB from "@/utils/aws";
import { TABLE_SUB_USER, TABLE_USERS_CAMPAIGNS } from "./api-constants";
import {
  Campaign,
  CampaignPK,
  NEW_USER,
  SubUserPK,
  User,
  UserPK,
} from "./users/db-uc-types";
import { ObjectPK, Object } from "./objects/db-object-types";
import { decodeAndGunzip, gzipAndEncode } from "../_lib/gzip";

export async function putSubUserMap(subUser: SubUserPK) {
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
  return fetchResult.Item as SubUserPK;
}

export async function deleteSubUser(sub: string) {
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
  await dynamoDB.put(putParams).promise();
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
  const rawData =
    fetchResult.Item?.data && typeof fetchResult.Item?.data === "string"
      ? await decodeAndGunzip(fetchResult.Item?.data)
      : "{}";
  return {
    pk,
    data: JSON.parse(rawData) as User["data"],
  };
}

export async function deleteUser(pk: UserPK) {
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

export async function getCampaign(pk: string): Promise<Campaign | null> {
  const fetchResult = await dynamoDB
    .get({
      TableName: TABLE_USERS_CAMPAIGNS,
      Key: {
        pk,
      },
    })
    .promise();
  if (!fetchResult.Item) return null;
  const rawData =
    fetchResult.Item?.data && typeof fetchResult.Item?.data === "string"
      ? await decodeAndGunzip(fetchResult.Item?.data)
      : "{}";
  return {
    pk,
    data: JSON.parse(rawData) as Campaign["data"],
  };
}

export async function deleteCampaign(pk: string) {
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
  return {
    pk,
    campaign,
    data: JSON.parse(rawData),
  } as Object;
}

export async function deleteObject(pk: ObjectPK, campaign: CampaignPK) {
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
