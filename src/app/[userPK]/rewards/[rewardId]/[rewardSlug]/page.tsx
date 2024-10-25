import LoadingPage from "@/app/_components/LoadingPage";
import ViewReward from "./ViewReward";
import { Reward } from "@/app/_data/db-reward-types";
import { getReward } from "@/app/_data/rewards-dto";
import PageLayout from "@/app/_components/PageLayout";

async function RewardPage({
  params,
}: {
  params: { userPK: string; rewardId: string };
}) {
  const reward = (await getReward(params.rewardId, params.userPK)) as Reward;
  if (!reward) return <LoadingPage />;

  return (
    <PageLayout>
      <ViewReward reward={reward} />
    </PageLayout>
  );
}

export default RewardPage;
