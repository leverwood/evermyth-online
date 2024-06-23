import { Button } from "react-bootstrap";

import LoadingPage from "../_components/LoadingPage";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import { getUser, getCampaigns } from "../api/dao";
import Unauthorized from "../_components/Unauthorized";

const getCampaignsServer = async () => {
  const session = await getSession();
  if (!session) {
    return { status: 401 };
  }

  const { userPK } = session.user;
  const user = await getUser(userPK);
  if (!user) {
    return { status: 404 };
  }

  if (!user.data.campaigns || user.data.campaigns.length === 0) {
    return {
      status: 200,
      data: [],
    };
  }
  const campaigns = await getCampaigns(user.data.campaigns);
  return {
    status: 200,
    data: campaigns,
  };
};

async function DashboardPage() {
  const campaignResponse = await getCampaignsServer();

  if (campaignResponse.status === 401) return <Unauthorized />;
  if (campaignResponse.status === 404) return <div>Not found</div>;
  if (!campaignResponse.data) return <LoadingPage />;
  const campaigns = campaignResponse.data;

  // TODO: fetch campaigns from the API
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
