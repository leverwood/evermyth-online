"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter, usePathname } from "next/navigation";

import { User, isUser } from "@/app/api/users/db-uc-types";
import { APIResponse } from "../api/db-types";

interface UserContextProps {
  user: User | null;
  loggedIn: boolean | null;
  isLoadingAuth: boolean;
  createUsername: (username: string) => Promise<APIResponse>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

async function postCreateUser(sub: string, username: string, user: User) {
  const result = await fetch(`/api/users/create`, {
    method: "POST",
    body: JSON.stringify({
      sub,
      ...user,
      pk: username,
    }),
  }).then((res) => res.json());

  return result;
}

// Get the User object from the UsersCampaigns database
async function getUserData() {
  const res = await fetch(`/api/users/login`);
  return await res.json();
}

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: auth0Data, isLoading: isAuth0Loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  // only fetch the data once, don't try again
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // not logged in
    if (!isAuth0Loading && !auth0Data) {
      setIsLoadingAuth(false);
      setLoggedIn(false);
    }

    if (auth0Data) {
      setUser((prevUser) => {
        if (!prevUser) return null;
        const newUser: User = {
          ...prevUser,
          pk: (auth0Data?.userPK as string) || "",
          data: {
            ...prevUser.data,
            email: auth0Data.email || "",
          },
        };
        return newUser;
      });
    }
  }, [auth0Data, isAuth0Loading]);

  useEffect(() => {
    if (isAuth0Loading || !auth0Data?.sub || user || dataFetched) return;

    // we got the auth0data, but not the user data
    setDataFetched(true);
    getUserData().then((response: APIResponse) => {
      setIsLoadingAuth(false);
      console.log(`getUserData response:`, response);
      if (response.success && response.data.user) {
        setLoggedIn(true);
        setUser(response.data.user);
        // the user doesn't have a username
        if (!response.data.user.pk) {
          const user: User = {
            pk: "",
            data: {
              type: "user",
              email: auth0Data.email || "",
              isSuperuser: false,
              campaigns: [],
            },
          };
          setUser(user);
          if (pathname !== "/profile") router.push("/profile");
          console.log(`forward to profile because doesn't have a username`);
        } else if (isUser(response.data.user)) {
          setUser(response.data.user);
        } else {
          console.log(`response.data is not a user:`, response.data.user);
        }
      } else {
        console.error(response.message, response.error);
      }
    });
  }, [auth0Data, dataFetched, isAuth0Loading, pathname, router, user]);

  const createUsername = useCallback(
    async (username: string) => {
      if ((user && user.pk) || !auth0Data?.sub || !user) return;
      const result = await postCreateUser(auth0Data.sub, username, user);
      if (result.success) {
        setUser((prevUser) => {
          // sanity check the user is of the correct format
          if (!isUser(prevUser)) return null;
          if (prevUser) {
            return { ...prevUser, pk: username };
          }
          return null;
        });
        router.push("/dashboard");
      }
      return result;
    },
    [auth0Data, router, user]
  );

  return (
    <UserContext.Provider
      value={{ user, isLoadingAuth, loggedIn, createUsername }}
    >
      {children}
    </UserContext.Provider>
  );
};