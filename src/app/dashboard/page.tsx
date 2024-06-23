"use client";

import { Button } from "react-bootstrap";

import { useAuth } from "../[user]/useAuth";
import LoadingPage from "../_components/LoadingPage";
import Link from "next/link";

function DashboardPage() {
  const { user } = useAuth();

  if (!user) return <LoadingPage />;

  const { campaigns } = user.data;

  // TODO: fetch campaigns from the API
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Campaigns</h2>
      {!campaigns.length ? <p>You don&apos;t have any campaigns yet.</p> : null}
      <Link href="/campaigns/add">
        <Button variant="primary">Create new</Button>
      </Link>
    </div>
  );
}
export default DashboardPage;
