import { Button } from "react-bootstrap";

import Link from "next/link";
import DashboardTitle from "./DashboardTitle";
import { getCampaignsForUser } from "@/app/_data/campaigns-dto";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }
  const { data: campaigns } = await getCampaignsForUser(session.user.userPK);

  return (
    <div>
      <DashboardTitle userPK={session.user.userPK} />
      <h2>Campaigns</h2>
      {!campaigns || !campaigns.length ? (
        <p>You don&apos;t have any campaigns yet.</p>
      ) : (
        campaigns.map((campaign) => (
          <div key={campaign.pk}>
            <Link href={`/${campaign.pk}/`}>
              <h3>{campaign.data.name}</h3>
            </Link>
          </div>
        ))
      )}
      <Link href="/campaigns/add">
        <Button variant="primary">Create new</Button>
      </Link>
    </div>
  );
}
export default DashboardPage;
