import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import { isCampaign } from "@/app/api/users/db-uc-types";
import { getCampaign, putCampaign } from "@/app/api/dao";

import {
  RESPOND_BAD_REQUEST,
  RESPOND_FORBIDDEN,
  RESPOND_NOT_FOUND,
  RESPOND_OK,
  RESPOND_UNAUTHORIZED,
} from "@/app/api/api-constants";
import { APIResponse } from "@/app/api/db-types";

// get a specific campaign
export async function GET(
  request: Request,
  { params }: { params: { userPK: string; slug: string } }
) {
  const session = await getSession();
  if (!session) {
    return RESPOND_UNAUTHORIZED;
  }

  const campaign = await getCampaign(`${params.userPK}/${params.slug}`);
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
export async function DELETE() {}
