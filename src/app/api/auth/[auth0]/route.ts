import {
  AfterCallbackAppRoute,
  AppRouteHandlerFnContext,
  Session,
  handleAuth,
  handleCallback,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { getSubUser } from "../../dao";

// @see https://github.com/auth0/nextjs-auth0/issues/1600
const afterCallback: AfterCallbackAppRoute = async (
  req: NextRequest,
  session: Session
) => {
  const subUser = await getSubUser(session.user.sub);
  // the user exists in the UserCampaigns database, store their username
  session.user.userPK = subUser.userPK;
  return session;
};

export const GET = handleAuth({
  async callback(req: NextRequest, ctx: AppRouteHandlerFnContext) {
    const res = (await handleCallback(req, ctx, {
      afterCallback,
    })) as NextResponse;
    return res;
  },
});
