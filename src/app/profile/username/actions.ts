"use server";

import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import { UserPK, initUser } from "@/app/_data/db-uc-types";
import { SUPERUSERS } from "@/app/api/api-constants";
import { getUser, putUser } from "@/app/_data/user-dto";
import { SetUsernameFormState } from "@/app/profile/username/SetUsername";
import { putSubUserMap } from "@/app/_data/subuser-dto";
import { getUsernameFromSession, userLoggedIn } from "@/app/_lib/auth";

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function doNothing(
  prevState: SetUsernameFormState,
  formData: FormData
): Promise<SetUsernameFormState> {
  await getUsernameFromSession();
  // if (!loggedIn) {
  //   return {
  //     message: "You must be logged in to set a username",
  //     validity: "invalid",
  //   };
  // }
  return {
    message: "Nothing to do",
    validity: "valid",
  };
}

export async function saveUsername(
  prevState: SetUsernameFormState,
  formData: FormData
): Promise<SetUsernameFormState> {
  const loggedIn = await getSession();
  if (!loggedIn) {
    redirect("/api/auth/login");
  }

  // you already have a username, you never needed to be here in the first place, go to dashboard
  if (await getUsernameFromSession()) {
    console.log("Already have a username");
    redirect("/dashboard");
  }

  let userPK = formData.get("userPK") as UserPK;
  userPK = userPK.trim();

  // if userPK is too short or too long, return an error
  if (!userPK || userPK.length < 3 || userPK.length > 20) {
    console.log("Username must be between 3 and 20 characters");
    return {
      message: "Username must be between 3 and 20 characters",
      validity: "invalid",
    };
  }
  // if userPK contains invalid characters, return an error
  if (!/^[a-zA-Z0-9_]*$/.test(userPK)) {
    return {
      message: "Username can only contain letters and numbers, and underscores",
      validity: "invalid",
    };
  }

  if (userPK === "dashboard") {
    console.log("Username is reserved");
    return {
      message: "Username is reserved",
      validity: "invalid",
    };
  }

  // check if the user already exists
  try {
    const userExists = await getUser(userPK);
    if (userExists) {
      console.log("Username already exists");
      return {
        message: "Username already exists",
        validity: "invalid",
      };
    }
  } catch (e) {
    console.error(`Error getting user`, e);
    return {
      message: "Server error checking if username exists",
      validity: null,
    };
  }

  // We're good to go. Associate the sub with the userPK
  // try {
  //   console.log(`Writing sub to userPK: ${session.user.sub} -> ${userPK}`);
  //   await putSubUserMap({
  //     sub: session.user.sub,
  //     userPK,
  //   });
  // } catch (e) {
  //   console.error(`Error mapping id to new username`, e);
  //   return {
  //     ...prevState,
  //     message: "Server error setting username",
  //     validity: null,
  //   };
  // }

  // // create a user in the user table
  // const { email } = session.user;
  // console.log(`Creating user in user table: ${userPK}`);
  // const newUser = initUser({
  //   pk: userPK,
  //   data: { email, isSuperuser: SUPERUSERS.includes(email) },
  // });

  // // try to put the user
  // try {
  //   await putUser(newUser);
  // } catch (e) {
  //   console.error(`Server error saving user`, e);
  //   return {
  //     ...prevState,
  //     message: "Server error saving user",
  //     validity: null,
  //   };
  // }

  // console.log(`Updating session: ${userPK}`);
  // await updateSession({
  //   ...session,
  //   user: {
  //     ...session.user,
  //     userPK,
  //   },
  // });
  // session.user.userPK = userPK;

  // success!
  // return {
  //   ...prevState,
  //   message: "Username saved",
  //   validity: "valid",
  // };
  redirect("/dashboard");
}
