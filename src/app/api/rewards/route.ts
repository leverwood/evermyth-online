import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import {
  deleteReward,
  getRewards,
  getRewardsForUser,
  putReward,
} from "@/app/_data/rewards-dto";
import { getUser, putUser } from "@/app/_data/user-dto";
import {
  RESPOND_BAD_REQUEST,
  RESPOND_FORBIDDEN,
  RESPOND_NOT_FOUND,
  RESPOND_OK,
  RESPOND_UNAUTHORIZED,
  respondServerError,
} from "../api-constants";
import { makeShortId } from "@/app/_data/make-id";
import { APIResponse } from "@/app/_data/db-types";
import { initReward } from "@/app/_data/db-reward-types";

export async function GET() {
  console.log(`Getting rewards`);
  const session = await getSession();
  if (!session) {
    return RESPOND_UNAUTHORIZED;
  }
  const { userPK } = session.user;
  const user = await getUser(userPK);
  if (!user) {
    return RESPOND_NOT_FOUND;
  }
  try {
    const response = await getRewardsForUser();
    return Response.json(response);
  } catch (e) {
    console.error(`Error getting rewards for user ${userPK}`, e);
    return RESPOND_NOT_FOUND;
  }
}

// Create a new reward
export async function POST(req: NextRequest) {
  // get the user's pk from the session
  const session = await getSession();
  if (!session) {
    return RESPOND_UNAUTHORIZED;
  }

  // the body of the request
  let dataRaw = await req.json();
  if (!dataRaw.data.name) {
    return RESPOND_BAD_REQUEST;
  }
  // check that the user in the session matches the reward
  const userPK = session.user.userPK;
  const user = await getUser(userPK);
  if (!user || !userPK) {
    return RESPOND_FORBIDDEN;
  }

  const rewardId = makeShortId();

  const data = initReward({
    ...dataRaw,
    pk: rewardId,
    userPK: userPK,
  });

  console.log(`Creating reward`, session.user.userPK);

  // update the reward
  await putReward(data);

  const response: APIResponse = {
    success: true,
    message: "Reward created",
    data: data,
  };
  return Response.json(response);
}
