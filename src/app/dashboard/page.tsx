import DashboardTitle from "./DashboardTitle";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import CampaignList from "./CampaignList";
import { Suspense } from "react";
import PageLayout from "../_components/PageLayout";

async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <PageLayout>
      <DashboardTitle userPK={session.user.userPK} />
      <Suspense fallback={<div>Loading...</div>}>
        <CampaignList />
      </Suspense>
    </PageLayout>
  );
}
export default DashboardPage;
