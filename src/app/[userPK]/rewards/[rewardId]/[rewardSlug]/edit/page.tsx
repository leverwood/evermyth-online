import LoadingPage from "@/app/_components/LoadingPage";
import { getSession } from "@auth0/nextjs-auth0";
import EditReward from "./EditReward";
import Unauthorized from "@/app/_components/Unauthorized";
import { getReward } from "@/app/_data/rewards-dto";
import PageLayout from "@/app/_components/PageLayout";

async function RewardPage({
  params,
}: {
  params: { userPK: string; rewardId: string };
}) {
  const session = await getSession();
  const reward = await getReward(params.rewardId, params.userPK);
  if (!reward) return <LoadingPage />;

  if (!session || params.userPK !== session.user.userPK) {
    return <Unauthorized />;
  }
  return (
    <PageLayout>
      <EditReward reward={reward} />
    </PageLayout>
  );
}

export default RewardPage;
