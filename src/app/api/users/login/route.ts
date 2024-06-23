import { initUser } from "@/app/api/users/db-uc-types";
import { APIResponse } from "@/app/api/db-types";
import { getSubUser, putSubUserMap } from "@/app/api/dao";
import { getUser, putUser } from "@/app/api/users/dao-users";
import { getSession } from "@auth0/nextjs-auth0";
import { RESPOND_UNAUTHORIZED } from "@/app/api/api-constants";

const SUPERUSERS = ["leverwood"];

export async function GET(req: Request) {
  const session = await getSession();

  if (!session) {
    return RESPOND_UNAUTHORIZED;
  }

  const { sub, email } = session.user;

  try {
    // 1. query the SubUser Table
    const subUser = await getSubUser(sub);

    // the subUser doesn't exist yet, make it
    if (!subUser) {
      await putSubUserMap({
        sub,
        userPK: "",
      });
      const response: APIResponse = {
        success: true,
        message: "New sub user map created, no username yet",
        data: {
          user: initUser({ data: { email } }),
        },
      };
      return Response.json(response);
    }

    // the subUser already exists, but doesn't have a username yet
    if (!subUser.userPK) {
      const response: APIResponse = {
        success: true,
        message: "User exists, but no username",
        data: {
          user: initUser({ data: { email } }),
        },
      };
      return Response.json(response);
    }

    // user exists and has a username
    const userData = await getUser(subUser.userPK);

    if (!userData) {
      console.log(`there is no user in the user table, make one`);
      const newUser = initUser({ pk: subUser.userPK, data: { email } });
      await putUser(newUser);
      const response: APIResponse = {
        success: true,
        message:
          "User exists in subUser table, but no data in user table. Created new.",
        data: {
          user: newUser,
        },
      };
      return Response.json(response);
    }

    // make superusers
    if (SUPERUSERS.includes(userData.pk) && !userData.data.isSuperuser) {
      console.log(`making ${userData.pk} a superuser`);
      userData.data.isSuperuser = true;
      await putUser(userData);
    }

    // update email if it is blank
    if (!userData.data.email && email) {
      console.log(`updating email for ${userData.pk}`);
      userData.data.email = email;
      await putUser(userData);
    }

    const response: APIResponse = {
      success: true,
      message: "User found",
      data: {
        user: userData,
      },
    };

    return Response.json(response);
  } catch (error: any) {
    const apiResponse: APIResponse = {
      success: false,
      message: `500 DynamoDB error: ${error.message}`,
      data: null,
    };
    console.error(error);
    return Response.json(apiResponse, {
      status: 500,
    });
  }
}
