"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { UserSession } from "@/app/_data/db-uc-types";
import { getUsernameFromSession } from "../profile/actions";
import { useEffect, useState } from "react";

export default function DashboardTitle() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    getUsernameFromSession().then((username) => setUsername(username));
  }, []);

  return (
    <main>
      <h1>Hello, {username}</h1>
    </main>
  );
}
