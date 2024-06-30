import DashboardTitle from "./DashboardTitle";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import CampaignList from "./CampaignList";

async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }

  return (
    <div>
      <DashboardTitle userPK={session.user.userPK} />
      <CampaignList />
    </div>
  );
}
export default DashboardPage;
