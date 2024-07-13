import LoadingPage from "@/app/_components/LoadingPage";
import { getCampaign } from "@/app/_data/campaigns-dto";
import { getSession } from "@auth0/nextjs-auth0";
import EditCampaign from "./EditCampaign";
import ViewCampaign from "./ViewCampaign";
import PageLayout from "@/app/_components/PageLayout";

async function CampaignPage({
  params,
}: {
  params: { userPK: string; campaignId: string };
}) {
  const session = await getSession();
  const campaign = await getCampaign(`${params.userPK}/${params.campaignId}`);
  if (!campaign) return <LoadingPage />;
  const userPk = campaign.pk.split("/")[0];

  return (
    <PageLayout campaign={campaign}>
      {session && userPk === session.user.userPK ? (
        <EditCampaign campaign={campaign} />
      ) : (
        <ViewCampaign campaign={campaign} />
      )}
    </PageLayout>
  );
}

export default CampaignPage;
