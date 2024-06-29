import { Button } from "react-bootstrap";

import Link from "next/link";
import { getCampaignsForUser } from "../api/campaigns/dao-campaigns";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const session = await getSession();
  const campaignResponse = await getCampaignsForUser();

  if (!session) redirect("/");

  // TODO: handle unauthorized and errors
  if (!campaignResponse.data) return <p>{campaignResponse.message}</p>;

  const campaigns = campaignResponse.data;

  return (
    <div>
      <h1>Hello, {session.user.userPK}</h1>
      <h2>Campaigns</h2>
      {!campaigns.length ? (
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
