import { APIResponse } from "./db-types";

export const TABLE_SUB_USER = "EMSubUsername";
export const TABLE_USERS_CAMPAIGNS = "EMUsersCampaigns";
export const TABLE_OBJECTS = "EMObjects";

const unauthorized: APIResponse = {
  message: "401 Unauthorized",
  success: false,
  data: null,
};
export const RESPOND_UNAUTHORIZED = Response.json(unauthorized, {
  status: 401,
});

const forbidden: APIResponse = {
  message: "403 Forbidden",
  success: false,
  data: null,
};
export const RESPOND_FORBIDDEN = Response.json(forbidden, { status: 403 });

const badRequest: APIResponse = {
  message: "400 Bad Request",
  success: false,
  data: null,
};
export const RESPOND_BAD_REQUEST = Response.json(badRequest, { status: 400 });

const notFound: APIResponse = {
  message: "404 Not Found",
  success: false,
  data: null,
};
export const RESPOND_NOT_FOUND = Response.json(notFound, { status: 404 });

const ok: APIResponse = {
  message: "200 OK",
  success: true,
  data: null,
};
export const RESPOND_OK = Response.json(ok, { status: 200 });
