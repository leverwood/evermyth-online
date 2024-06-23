import LoadingPage from "@/app/_components/LoadingPage";
import { getCampaign } from "@/app/api/campaigns/dao-campaigns";
import { deleteCampaign } from "@/app/api/campaigns/dao-campaigns";
import { Button } from "react-bootstrap";

async function CampaignPage({
  params,
}: {
  params: { userPK: string; slug: string };
}) {
  const campaign = await getCampaign(`${params.userPK}/${params.slug}`);
  if (!campaign) return <LoadingPage />;

  return (
    <div>
      <h1>{campaign.data.name}</h1>
      <p>Owner: {campaign.data.owner}</p>
      <p>{JSON.stringify(campaign)}</p>
      <Button variant="danger">Delete</Button>
    </div>
  );
}

export default CampaignPage;
