import LoadingPage from "@/app/_components/LoadingPage";
import PageLayout from "@/app/_components/PageLayout";
import { getCampaign } from "@/app/_data/campaigns-dto";
import styles from "./page.module.scss";

const RewardsPage = async ({
  params,
}: {
  params: { userPK: string; campaignId: string };
}) => {
  const campaign = await getCampaign(`${params.userPK}/${params.campaignId}`);
  if (!campaign) return <LoadingPage />;

  return (
    <PageLayout campaign={campaign}>
      <main className={styles.root}>
        <h1>Rewards</h1>
      </main>
    </PageLayout>
  );
};

export default RewardsPage;
