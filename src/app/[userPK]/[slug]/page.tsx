import LoadingPage from "@/app/_components/LoadingPage";
import { getCampaign } from "@/app/api/dao";

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
      <p>{JSON.stringify(campaign)}</p>
    </div>
  );
}

export default CampaignPage;
