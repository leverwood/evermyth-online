import dynamoDB from "@/utils/aws";
import { GetItemOutput } from "aws-sdk/clients/dynamodb";
import { SubUserPK, User } from "@/app/api/users/db-uc-types";
import { APIResponse } from "@/app/api/db-types";
import { TABLE_SUB_USER, TABLE_USERS_CAMPAIGNS } from "@/app/api/api-constants";

// Set up a sub user key in the database the first time you try to login
async function putSubUserMap(sub: string): Promise<APIResponse> {
  try {
    const subUser: SubUserPK = {
      sub,
      userPK: "",
    };
    const newUser: User = {
      pk: "",
      data: {
        type: "user",
        email: "",
        campaigns: [],
        isSuperuser: false,
      },
    };
    const putParams = {
      TableName: TABLE_SUB_USER,
      Item: subUser,
    };
    await dynamoDB.put(putParams).promise();
    return {
      success: true,
      message: "User created",
      data: {
        user: newUser,
      },
    };
  } catch (e) {
    return {
      success: false,
      message: "Error creating user",
      error: e,
      data: null,
    };
  }
}

async function getUserData(pk: string): Promise<User> {
  const fetchResult: GetItemOutput = await dynamoDB
    .get({
      TableName: TABLE_USERS_CAMPAIGNS,
      Key: {
        pk,
      },
    })
    .promise();

  // TODO: check if item is of the right format

  return {
    pk,
    data: fetchResult.Item?.data as User["data"],
  };
}

export async function GET(req: Request) {
  const urlParams = new URL(req.url).searchParams;
  const sub = urlParams.get("sub");

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
    const fetchUserPK: GetItemOutput = await dynamoDB
      .get({
        TableName: TABLE_SUB_USER,
        Key: {
          sub,
        },
      })
      .promise();

    // the user doesn't exist yet
    if (!fetchUserPK.Item) {
      const createResult = await putSubUserMap(sub);
      if (!createResult.success) throw createResult.error;

      console.log("User created", createResult);
      return Response.json(createResult);
    }

    // the user already exists, but doesn't have a username yet
    const userPK = fetchUserPK.Item.userPK;

    console.log("fetchUserPK:", fetchUserPK.Item.userPK); // Log the value to debug
    if (!userPK) {
      const newUser: User = {
        pk: "",
        data: {
          type: "user",
          email: "",
          isSuperuser: false,
          campaigns: [],
        },
      };
      const response: APIResponse = {
        success: true,
        message: "User exists, but no username",
        data: {
          user: newUser,
        },
      };
      return Response.json(response);
    }

    // user exists and has a username
    const userData = await getUserData(userPK as string);
    const response: APIResponse = {
      success: true,
      message: "User exists and has a username",
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
