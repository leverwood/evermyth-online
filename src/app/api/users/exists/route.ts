import { GetItemOutput } from "aws-sdk/clients/dynamodb";
import { APIResponse } from "../../db-types";
import { TABLE_USERS_CAMPAIGNS } from "../../api-constants";
import dynamoDB from "@/utils/aws";

export async function getUsernameExists(
  username: string
): Promise<APIResponse> {
  try {
    const fetchResult: GetItemOutput = await dynamoDB
      .get({
        TableName: TABLE_USERS_CAMPAIGNS,
        Key: {
          pk: username,
        },
      })
      .promise();

    if (!fetchResult.Item) {
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
