import { getSession } from "@auth0/nextjs-auth0";
import { initCampaign, isCampaign } from "@/app/_data/db-uc-types";
import { NextRequest } from "next/server";
import {
  getCampaigns,
  getCampaignsForUser,
  putCampaign,
} from "@/app/_data/campaigns-dto";
import { getUser, putUser } from "@/app/_data/user-dto";
import {
  RESPOND_BAD_REQUEST,
  RESPOND_FORBIDDEN,
  RESPOND_NOT_FOUND,
  RESPOND_UNAUTHORIZED,
} from "../api-constants";
import { makeShortId } from "@/app/_data/make-id";
import { APIResponse } from "@/app/_data/db-types";

export async function GET() {
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
    const response = await getCampaignsForUser(userPK);
    return Response.json(response);
  } catch (e) {
    console.error(`Error getting campaigns for user ${userPK}`, e);
    return RESPOND_NOT_FOUND;
  }
}

// Create a new campaign
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
  // check that the user in the session matches the campaign
  const { userPK } = session.user;
  const user = await getUser(userPK);
  if (!user) {
    return RESPOND_FORBIDDEN;
  }

  const campaignId = makeShortId();

  const data = initCampaign({
    ...dataRaw,
    pk: `${userPK}/${campaignId}`,
  });

  // update the campaign
  await putCampaign(data);

  // add the campaign to the user data
  user.data.campaigns.push(data.pk);
  await putUser(user);

  const response: APIResponse = {
    success: true,
    message: "Campaign created",
    data: data,
  };
  return Response.json(response);
}
