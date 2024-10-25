import dynamoDB from "@/utils/aws";
import { TABLE_USERS_CAMPAIGNS } from "@/app/api/api-constants";
import { CampaignPK } from "@/app/_data/db-uc-types";
import { ObjectPK, Object } from "@/app/_data/db-object-types";
import { decodeAndGunzip, gzipAndEncode } from "@/app/_lib/gzip";

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
  await dynamoDB.put(putParams);
  return true;
}

export async function getObject(
  pk: ObjectPK,
  campaign: CampaignPK
): Promise<Object | null> {
  const fetchResult = await dynamoDB.get({
    TableName: TABLE_USERS_CAMPAIGNS,
    Key: {
      pk,
      campaign,
    },
  });
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
  await dynamoDB.delete(deleteParams);
  return true;
}