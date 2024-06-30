"use server";

import dynamoDB from "@/utils/aws";
import { decodeAndGunzip, gzipAndEncode } from "@/app/_lib/gzip";
import { TABLE_USERS_CAMPAIGNS } from "@/app/api/api-constants";
import { User, UserPK, initUser } from "@/app/_data/db-uc-types";
import { getSession } from "@auth0/nextjs-auth0";
import { userAuthorized } from "../_lib/auth";

export async function putUser(user: User) {
  if (!user.pk) {
    throw new Error("No pk provided");
  }
  if (!userAuthorized(user.pk)) {
    throw new Error("Not authorized to put user");
  }

  const putParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Item: {
      pk: user.pk,
      data: await gzipAndEncode(JSON.stringify(user.data)),
    },
  };
  const result = await dynamoDB.put(putParams);
  return true;
}

export async function getUser(pk: UserPK): Promise<User | null> {
  if (!pk) {
    throw new Error("No pk provided");
  }
  const fetchResult = await dynamoDB.get({
    TableName: TABLE_USERS_CAMPAIGNS,
    Key: {
      pk,
    },
  });
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
  if (!pk) {
    throw new Error("No pk provided");
  }
  if (!userAuthorized(pk)) {
    throw new Error("Not authorized to delete user");
  }
  const deleteParams = {
    TableName: TABLE_USERS_CAMPAIGNS,
    Key: {
      pk,
    },
  };
  await dynamoDB.delete(deleteParams);
}
