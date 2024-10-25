import { NextResponse } from "next/server";
import { APIResponse } from "../_data/db-types";

export const TABLE_SUB_USER = "EMSubUsername";
export const TABLE_USERS_CAMPAIGNS = "EMUsersCampaigns";
export const TABLE_OBJECTS = "EMObjects";
export const TABLE_REWARDS = "EMRewards";
export const SUPERUSERS = ["lilia.everwood@gmail.com"];

const unauthorized: APIResponse = {
  message: "401 Unauthorized",
  success: false,
  data: null,
};
export const RESPOND_UNAUTHORIZED = NextResponse.json(unauthorized, {
  status: 401,
});

const forbidden: APIResponse = {
  message: "403 Forbidden",
  success: false,
  data: null,
};
export const RESPOND_FORBIDDEN = NextResponse.json(forbidden, { status: 403 });

const badRequest: APIResponse = {
  message: "400 Bad Request",
  success: false,
  data: null,
};
export const RESPOND_BAD_REQUEST = NextResponse.json(badRequest, {
  status: 400,
});

const notFound: APIResponse = {
  message: "404 Not Found",
  success: false,
  data: null,
};
export const RESPOND_NOT_FOUND = NextResponse.json(notFound, { status: 404 });

const ok: APIResponse = {
  message: "200 OK",
  success: true,
  data: null,
};
export const RESPOND_OK = NextResponse.json(ok, { status: 200 });

export const respondServerError = (message: string, data?: any) => {
  const response: APIResponse = {
    message,
    success: false,
    data: data,
  };
  return NextResponse.json(response, { status: 500 });
};