import { Button } from "react-bootstrap";

import Link from "next/link";
import DashboardTitle from "./DashboardTitle";
// import { getCampaignsForUser } from "../_data/dao-campaigns";
// import { getSession } from "@auth0/nextjs-auth0/edge";
// import { redirect } from "next/navigation";

async function DashboardPage() {
  // const session = await getSession();
  // const campaignResponse = await getCampaignsForUser();

  // TODO: handle unauthorized and errors
  // if (!campaignResponse.data) return <p>{campaignResponse.message}</p>;

  // const campaigns = campaignResponse.data;
  //
  // if (!session) return null;

  return (
    <div>
      <DashboardTitle />
      <h2>Campaigns</h2>
      {/* {!campaigns.length ? (
        <p>You don&apos;t have any campaigns yet.</p>
      ) : (
        campaigns.map((campaign) => (
          <div key={campaign.pk}>
            <Link href={`/${campaign.pk}/`}>
              <h3>{campaign.data.name}</h3>
            </Link>
          </div>
        ))
      )} */}
      <Link href="/campaigns/add">
        <Button variant="primary">Create new</Button>
      </Link>
    </div>
  );
}
export default DashboardPage;
