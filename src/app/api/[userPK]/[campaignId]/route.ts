import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import { isCampaign } from "@/app/_data/db-uc-types";

import {
  RESPOND_BAD_REQUEST,
  RESPOND_FORBIDDEN,
  RESPOND_NOT_FOUND,
  RESPOND_OK,
  RESPOND_UNAUTHORIZED,
  respondServerError,
} from "@/app/api/api-constants";
import { APIResponse } from "@/app/_data/db-types";
import {
  deleteCampaignDTO,
  getCampaign,
  putCampaign,
} from "@/app/_data/campaigns-dto";

// get a specific campaign
export async function GET(
  request: Request,
  { params }: { params: { userPK: string; campaignId: string } }
) {
  const session = await getSession();
  if (!session) {
    return RESPOND_UNAUTHORIZED;
  }

  const campaign = await getCampaign(`${params.userPK}/${params.campaignId}`);
  if (!campaign) {
    return RESPOND_NOT_FOUND;
  }

  const response: APIResponse = {
    success: true,
    message: "Campaign data",
    data: campaign,
  };
  return Response.json(response);
}

// update a specific campaign
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return RESPOND_UNAUTHORIZED;
  }

  // the body of the request
  const data = await req.json();
  if (!isCampaign(data)) {
    return RESPOND_BAD_REQUEST;
  }

  // TODO: check that the url slug  matches the campaign

  // check that the user in the session matches the campaign
  const { userPK } = session.user;
  const [campaignUser] = data.pk.split("/");
  if (userPK !== campaignUser) {
    return RESPOND_FORBIDDEN;
  }

  // update the campaign
  await putCampaign(data);
  return RESPOND_OK;
}

// delete a specific campaign
export async function DELETE(
  request: Request,
  { params }: { params: { userPK: string; campaignId: string } }
) {
  console.log(`delete`, params.userPK, params.campaignId);
  const session = await getSession();
  if (!session) {
    return RESPOND_UNAUTHORIZED;
  }

  // check that the user in the session matches the campaign
  const { userPK: loggedInUser } = session.user;
  if (loggedInUser !== params.userPK) {
    return RESPOND_FORBIDDEN;
  }

  const pk = `${params.userPK}/${params.campaignId}`;

  // delete the campaign
  try {
    await deleteCampaignDTO(`${params.userPK}/${params.campaignId}`);
  } catch (e) {
    console.error(e);
    return respondServerError("Error deleting campaign", pk);
  }
  return RESPOND_OK;
}
