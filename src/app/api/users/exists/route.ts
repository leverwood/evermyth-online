import { GetItemOutput } from "aws-sdk/clients/dynamodb";
import { APIResponse } from "../../db-types";
import { TABLE_USERS_CAMPAIGNS } from "../../api-constants";
import dynamoDB from "@/utils/aws";
import { UserPK } from "../db-uc-types";
import { getUser } from "../../dao";

export async function getUsernameExists(pk: UserPK): Promise<APIResponse> {
  try {
    const user = await getUser(pk);

    if (!user) {
      return {
        success: true,
        message: "Username is available",
        data: {
          usernameExists: false,
        },
      };
    } else {
      return {
        success: true,
        message: "Username already exists",
        data: {
          usernameExists: true,
        },
      };
    }
  } catch (e: any) {
    return {
      success: false,
      message: "Error fetching username",
      error: {
        message: e.message,
      },
      data: null,
    };
  }
}

export async function GET(req: Request) {
  const urlParams = new URL(req.url).searchParams;
  const username = urlParams.get("username");

  if (!username) {
    const response: APIResponse = {
      success: false,
      message: "No username provided",
      data: null,
    };
    return Response.json(response, {
      status: 400,
    });
  }

  const result = await getUsernameExists(username);
  return Response.json(result, {
    status: result.success ? 200 : 500,
  });
}
