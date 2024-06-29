"use server";

import { getSession, updateSession } from "@auth0/nextjs-auth0";
import { UserPK, initUser } from "@/app/api/users/db-uc-types";
import { redirect } from "next/navigation";
import { SUPERUSERS } from "@/app/api/api-constants";
import { getUser, putUser } from "./dbaccess-user";
import { SetUsernameFormState } from "./SetUsername";
import { putSubUserMap } from "./dbaccess-subuser";

export async function setUsername(
  prevState: SetUsernameFormState,
  formData: FormData
): Promise<SetUsernameFormState> {
  console.log("Setting username");
  const session = await getSession();
  const userPK = formData.get("userPK") as UserPK;

  // you need to be logged in to set a username
  if (!session) {
    console.log("Not logged in");
    redirect("/api/auth/login");
  }

  // you already have a username, you never needed to be here in the first place, go home
  if (session && session.user.sub && session.user.userPK) {
    console.log("Already have a username");
    redirect("/");
  }

  // if userPK is too short or too long, return an error
  if (!userPK || userPK.length < 3 || userPK.length > 20) {
    console.log("Username must be between 3 and 20 characters");
    return {
      ...prevState,
      message: "Username must be between 3 and 20 characters",
      validity: "invalid",
    };
  }

  // if userPK contains invalid characters, return an error
  if (!/^[a-zA-Z0-9]*$/.test(userPK)) {
    console.log("Username can only contain letters and numbers");
    return {
      ...prevState,
      message: "Username can only contain letters and numbers",
      validity: "invalid",
    };
  }

  // check if the user already exists
  try {
    const userExists = await getUser(userPK);
    if (userExists) {
      console.log("Username already exists");
      return {
        ...prevState,
        message: "Username already exists",
        validity: "invalid",
      };
    }
  } catch (e) {
    console.error(`Error getting user`, e);
    return {
      ...prevState,
      message: "Server error checking if username exists",
      validity: null,
    };
  }

  // We're good to go. Associate the sub with the userPK
  try {
    await putSubUserMap({
      sub: session.user.sub,
      userPK,
    });
  } catch (e) {
    console.error(`Error mapping id to new username`, e);
    return {
      ...prevState,
      message: "Server error setting username",
      validity: null,
    };
  }

  // create a user in the user table
  const { email } = session.user;
  const newUser = initUser({
    pk: userPK,
    data: { email, isSuperuser: SUPERUSERS.includes(email) },
  });

  // try to put the user
  try {
    await putUser(newUser);
  } catch (e) {
    console.error(`Server error saving user`, e);
    return {
      ...prevState,
      message: "Server error saving user",
      validity: null,
    };
  }

  updateSession({
    ...session,
    user: {
      ...session.user,
      userPK,
    },
  });

  redirect("/dashboard");
}
