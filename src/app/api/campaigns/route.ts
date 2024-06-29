import { getSession } from "@auth0/nextjs-auth0";
import { initCampaign, isCampaign } from "../users/db-uc-types";
import { NextRequest } from "next/server";
import { putCampaign } from "./dao-campaigns";
import { getUser, putUser } from "@/app/profile/dbaccess-user";
import {
  RESPOND_BAD_REQUEST,
  RESPOND_FORBIDDEN,
  RESPOND_NOT_FOUND,
  RESPOND_OK,
  RESPOND_UNAUTHORIZED,
} from "../api-constants";

// Create a new campaign
export async function POST(req: NextRequest) {
  // get the user's pk from the session
  const session = await getSession();
  if (!session) {
    return RESPOND_UNAUTHORIZED;
  }

  // the body of the request
  let dataRaw = await req.json();
  if (!isCampaign(dataRaw)) {
    return RESPOND_BAD_REQUEST;
  }
  const data = initCampaign(dataRaw);

  // check that the user in the session matches the campaign
  const { userPK } = session.user;
  const [campaignUser] = data.pk.split("/");
  if (userPK !== campaignUser) {
    return RESPOND_FORBIDDEN;
  }

  const user = await getUser(userPK);

  if (!user) {
    return RESPOND_NOT_FOUND;
  }

  // update the campaign
  await putCampaign(data);

  // add the campaign to the user data
  user.data.campaigns.push(data.pk);
  await putUser(user);

  return RESPOND_OK;
}
