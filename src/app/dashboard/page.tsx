import { Button } from "react-bootstrap";

import Link from "next/link";
import { getCampaignsForUser } from "../api/campaigns/dao-campaigns";

async function DashboardPage() {
  const campaignResponse = await getCampaignsForUser();

  // TODO: handle unauthorized and errors
  if (!campaignResponse.data) return <p>{campaignResponse.message}</p>;

  const campaigns = campaignResponse.data;

  return (
    <div>
      <h1>Dashboard</h1>
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
