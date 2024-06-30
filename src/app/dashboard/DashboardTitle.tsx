"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { UserSession } from "../_data/db-uc-types";

export default function DashboardTitle({ userPK }: { userPK: string }) {
  const { user } = useUser();

  return (
    <main>
      <h1>Hello, {userPK}</h1>
    </main>
  );
}
