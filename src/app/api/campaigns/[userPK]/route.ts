import { getSession } from "@auth0/nextjs-auth0";
import { getCampaigns } from "../dao-campaigns";
import { getUser } from "../../users/dao-users";
import { RESPOND_NOT_FOUND, RESPOND_UNAUTHORIZED } from "../../api-constants";
import { APIResponse } from "../../db-types";

// get all of the campaigns for this user
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

  if (!user.data.campaigns || user.data.campaigns.length === 0) {
    const response: APIResponse = {
      message: "200 OK",
      success: true,
      data: [],
    };
    return Response.json(response, { status: 200 });
  }
  const campaigns = await getCampaigns(user.data.campaigns);
  const response: APIResponse = {
    message: "200 OK",
    success: true,
    data: {
      campaigns: campaigns,
    },
  };
  return Response.json(response, { status: 200 });
}
