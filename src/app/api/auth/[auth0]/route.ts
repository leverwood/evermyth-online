import {
  AfterCallbackAppRoute,
  AppRouteHandlerFnContext,
  Session,
  handleAuth,
  handleCallback,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { getSubUser, putSubUserMap } from "@/app/_data/dbaccess-subuser";
import { initUser } from "@/app/_data/db-uc-types";
import { getUser, putUser } from "@/app/_data/dbaccess-user";
import { SUPERUSERS } from "@/app/_data/api-constants";

// @see https://github.com/auth0/nextjs-auth0/issues/1600
const afterCallback: AfterCallbackAppRoute = async (req, session, state) => {
  const { sub, email } = session.user;

  const subUser = await getSubUser(session.user.sub);

  // the subUser doesn't exist yet, make it
  if (!subUser) {
    console.log(`afterCallback login: subUser doesn't exist yet`);
    try {
      await putSubUserMap({
        sub,
        userPK: "",
      });
    } catch (e) {
      console.error(`afterCallback login: Error putting subUserMap`, e);
    }
    session.user.userPK = "";
  }
  // check if the user exists in the user table
  else if (subUser && subUser.userPK) {
    session.user.userPK = subUser.userPK;
    console.log(`afterCallback login: subUser ${subUser.userPK} exists`);
    try {
      const user = getUser(subUser.userPK);
      if (!user) {
        console.log(
          `afterCallback login: user ${subUser.userPK} doesn't exist in user table`
        );
        const newUser = initUser({
          pk: subUser.userPK,
          data: { email, isSuperuser: SUPERUSERS.includes(email) },
        });
        await putUser(newUser);
      } else {
        console.log(
          `afterCallback login: user ${subUser.userPK} exists in user table`
        );
      }
    } catch (e) {
      console.error(`afterCallback login: Error getting user`, e);
    }
  }

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

