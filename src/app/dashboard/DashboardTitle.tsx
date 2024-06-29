"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { UserSession } from "@/app/_data/db-uc-types";

export default function DashboardTitle() {
  const { user } = useUser();
  return <h1>Hello, {(user as UserSession)?.userPK}</h1>;
}
