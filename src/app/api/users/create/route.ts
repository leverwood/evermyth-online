import dynamoDB from "@/utils/aws";
import { APIResponse } from "../../db-types";
import { getUsernameExists } from "../exists/route";
import { User, initUser } from "../db-uc-types";
import { putSubUserMap } from "../../dao";
import { putUser } from "../dao-users";

export async function POST(req: Request) {
  // Get the sub and username from the request body
  const { sub, pk, data } = await req.json();

  const user: User = initUser({ pk, data });

  if (!pk || !sub || !data) {
    const response: APIResponse = {
      success: false,
      message: "No username, sub, or data provided",
      data: null,
    };
    return Response.json(response, {
      status: 400,
    });
  }

  const result = await getUsernameExists(pk);

  if (result.error) {
    return Response.json(result, {
      status: 500,
    });
  }

  if (result.data.usernameExists) {
    const response: APIResponse = {
      success: false,
      message: "Username already exists",
      data: {
        usernameExists: true,
      },
    };
    return Response.json(response, {
      status: 409,
    });
  }

  try {
    // update the sub/userPK map
    await putSubUserMap({
      sub,
      userPK: pk,
    });

    // add the user data to the userscampaigns table
    await putUser(user);

    const response: APIResponse = {
      success: true,
      message: "User created and put in both tables",
      data: user,
    };
    return Response.json(response);
  } catch (e) {
    const response: APIResponse = {
      success: false,
      message: "Error creating user",
      error: e,
      data: null,
    };
    return Response.json(response, {
      status: 500,
    });
  }
}
