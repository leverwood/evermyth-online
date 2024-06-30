"use server";

import { getSession } from "@auth0/nextjs-auth0";
import { CampaignsResponse, getCampaignsForUser } from "../_data/campaigns-dto";

export async function getUsernameFromSession() {
  const session = await getSession();
  if (!session) return null;
  return session.user.userPK;
}

// get campaigns for logged in user
export async function getCampaigns(): Promise<CampaignsResponse> {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
      data: null,
    };
  }
  const userPK = session.user.userPK;
  const campaigns = await getCampaignsForUser(userPK);
  return campaigns;
}
