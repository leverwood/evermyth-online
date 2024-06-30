import DashboardTitle from "./DashboardTitle";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import CampaignList from "./CampaignList";
import { Suspense } from "react";

async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }

  return (
    <div>
      <DashboardTitle userPK={session.user.userPK} />
      <Suspense fallback={<div>Loading...</div>}>
        <CampaignList />
      </Suspense>
    </div>
  );
}
export default DashboardPage;
