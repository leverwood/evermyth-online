"use server";

import { getSession } from "@auth0/nextjs-auth0";

export async function getUsernameFromSession() {
  const session = await getSession();
  if (!session) return null;
  return session.user.userPK;
}
