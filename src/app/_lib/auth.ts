import { getSession } from "@auth0/nextjs-auth0";

export const userLoggedIn = async (): Promise<boolean> => {
  const session = await getSession();
  if (!session) {
    return false;
  }
  return true;
};

export const userAuthorized = async (userPK: string): Promise<boolean> => {
  const session = await getSession();
  if (!session) {
    return false;
  }
  return session.user.userPK === userPK;
};

export const getUsernameFromSession = async (): Promise<string | null> => {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session.user.userPK;
};
