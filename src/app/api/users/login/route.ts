import { initUser } from "@/app/api/users/db-uc-types";
import { APIResponse } from "@/app/api/db-types";
import { getSubUser, getUser, putSubUserMap, putUser } from "../../dao";

const SUPERUSERS = ["leverwood"];

export async function GET(req: Request) {
  const urlParams = new URL(req.url).searchParams;
  const sub = urlParams.get("sub");
  const email = urlParams.get("email") || "";

  if (!sub) {
    const response: APIResponse = {
      success: false,
      message: "No sub provided",
      data: null,
    };
    return Response.json(response, {
      status: 400,
    });
  }

  try {
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
          user: initUser({ pk: "", data: { email } }),
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
          user: initUser({ pk: "", data: { email } }),
        },
      };
      return Response.json(response);
    }

    // user exists and has a username
    const userData = await getUser(subUser.userPK);

    if (!userData) {
      // there is no user in the user table, make one
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
      userData.data.isSuperuser = true;
      await putUser(userData);
    }

    // update email if it is blank
    if (!userData.data.email && email) {
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
