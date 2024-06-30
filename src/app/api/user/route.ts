import { APIResponse } from "@/app/_data/db-types";
import { User } from "@/app/_data/db-uc-types";
import { getSubUser, putSubUserMap } from "@/app/_data/subuser-dto";
import { putUser } from "@/app/_data/user-dto";
import {
  RESPOND_BAD_REQUEST,
  RESPOND_OK,
  RESPOND_UNAUTHORIZED,
  SUPERUSERS,
} from "@/app/api/api-constants";
import {
  getSession,
  updateSession,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

// create a username
// TODO: Server-side validation
const POST = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  let username;
  try {
    const body = await req.json();
    console.log("body", body);
    username = body.username;
  } catch (e) {
    console.log("Couldn't read request", e);
    return RESPOND_BAD_REQUEST;
  }

  if (!session) return RESPOND_UNAUTHORIZED;
  if (!username) return RESPOND_BAD_REQUEST;

  // validate the username

  // must be between 3 and 20 characters
  if (username.length < 3 || username.length > 20) {
    const response: APIResponse = {
      success: false,
      message: "Username must be between 3 and 20 characters",
      data: {},
    };
    return Response.json(response, {
      status: 400,
    });
  }

  // username matches ^[a-zA-Z0-9_]*
  if (!/^[a-zA-Z0-9_]*$/.test(username)) {
    const response: APIResponse = {
      success: false,
      message: "Username must only contain letters, numbers, and underscores",
      data: {},
    };
    return Response.json(response, {
      status: 400,
    });
  }

  // username cannot be "dashboard"
  if (username === "dashboard") {
    const response: APIResponse = {
      success: false,
      message: "Username cannot be 'dashboard'",
      data: {},
    };
    return Response.json(response, {
      status: 400,
    });
  }

  // create the user
  const { sub } = session.user;

  const user: User = {
    pk: username,
    data: {
      type: "user",
      email: session.user.email,
      isSuperuser: SUPERUSERS.includes(session.user.email),
      campaigns: [],
    },
  };
  try {
    console.log(`putSubUserMap`);
    await putSubUserMap({
      sub,
      userPK: username,
    });
    console.log(`putUser`);
    await putUser(user);
    console.log(`update session`);
    await updateSession({
      ...session,
      user: {
        ...session.user,
        userPK: username,
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("Error creating user", { status: 500 });
  }

  return RESPOND_OK;
};

export { POST };
