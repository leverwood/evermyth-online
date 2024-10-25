import dynamoDB from "@/utils/aws";
import { getSession } from "@auth0/nextjs-auth0";
import NodeCache from "node-cache";

import { TABLE_REWARDS, TABLE_USERS_CAMPAIGNS } from "@/app/api/api-constants";
import { RewardPK, Reward, initReward } from "@/app/_data/db-reward-types";
import { decodeAndGunzip, gzipAndEncode } from "@/app/_lib/gzip";
import { APIResponse } from "./db-types";
import { UserPK } from "./db-uc-types";

const rewardsCache = new NodeCache();

export async function putReward(reward: Reward) {
  console.log(`putReward`, reward);
  if (!reward.pk || !reward.userPK) {
    throw new Error("No pk or user provided");
  }
  const putParams = {
    TableName: TABLE_REWARDS,
    Item: {
      pk: reward.pk,
      userPK: reward.userPK,
      data: await gzipAndEncode(JSON.stringify(reward.data)),
    },
  };
  await dynamoDB.put(putParams);
  return true;
}

export async function getReward(
  pk: RewardPK,
  userPK: UserPK
): Promise<Reward | null> {
  const fetchResult = await dynamoDB.get({
    TableName: TABLE_REWARDS,
    Key: {
      pk,
      userPK,
    },
  });
  if (!fetchResult.Item) return null;
  const rawData =
    fetchResult.Item?.data && typeof fetchResult.Item?.data === "string"
      ? await decodeAndGunzip(fetchResult.Item?.data)
      : "{}";

  const reward = {
    pk,
    userPK,
    type: "reward",
    data: JSON.parse(rawData),
  } as Reward;
  return initReward(reward);
}

export async function deleteReward(pk: RewardPK, userPK: UserPK) {
  console.log(`deleteReward`, pk, userPK);
  const deleteParams = {
    TableName: TABLE_REWARDS,
    Key: {
      pk,
      userPK,
    },
  };
  await dynamoDB.delete(deleteParams);
  return true;
}

export const getRewards = async (pks: RewardPK[]): Promise<Reward[]> => {
  const fetchResult = await dynamoDB.batchGet({
    RequestItems: {
      [TABLE_USERS_CAMPAIGNS]: {
        Keys: pks.map((pk) => ({ pk })),
      },
    },
  });
  if (!fetchResult.Responses) return [];

  const rewards = await Promise.all(
    fetchResult.Responses[TABLE_USERS_CAMPAIGNS].map(async (item) => {
      // format doesn't match
      const rawData =
        item.data && typeof item.data === "string"
          ? await decodeAndGunzip(item.data)
          : "{}";
      const dataObj = JSON.parse(rawData);
      return initReward({
        pk: item.pk,
        data: dataObj,
      });
    })
  );

  const nonNullRewards = rewards.filter(
    (reward) => reward !== null
  ) as Reward[];

  return nonNullRewards;
};

export interface RewardsResponse extends APIResponse {
  data: Reward[] | null;
}

export const getRewardsForUser = async (): Promise<RewardsResponse> => {
  console.log(`getRewardsForUser`);

  // get user
  const session = await getSession();
  if (!session || !session.user.userPK) {
    return {
      success: false,
      message: "Unauthorized",
      data: null,
    };
  }
  const userPK = session.user.userPK;

  // check cache
  if (userPK && rewardsCache.has(`${userPK}-rewards`)) {
    console.log(`getRewardsForUser from cache`, userPK);
    console.log("Rewards found from cache");
    return {
      message: "Rewards found",
      success: true,
      data: rewardsCache.get(`${userPK}-rewards`) as Reward[],
    };
  }

  const params = {
    TableName: "EMRewards",
    IndexName: "userPK-index", // Name of the GSI created for querying by userPK
    KeyConditionExpression: "userPK = :userPKValue",
    ExpressionAttributeValues: {
      ":userPKValue": userPK, // Replace with the actual userPK value
    },
  };

  console.log("Fetching rewards for user", userPK);
  const fetchResult = await dynamoDB.query(params);

  if (!fetchResult.Items) {
    return {
      success: true,
      message: "No rewards found",
      data: null,
    };
  }

  const rawData = [];

  for (const item of fetchResult.Items) {
    if (item && typeof item.data === "string") {
      rawData.push({
        ...item,
        data: await decodeAndGunzip(item.data),
      });
    }
  }

  const rewards = rawData.map((item, index) =>
    initReward({
      ...item,
      type: "reward",
      data: JSON.parse(item.data),
    } as Reward)
  );

  return {
    success: true,
    message: "Rewards found",
    data: rewards,
  };
};
