import LoadingPage from "@/app/_components/LoadingPage";
import { getObject } from "@/app/_data/object-dto";
import { getSession } from "@auth0/nextjs-auth0";
import EditReward from "./EditReward";
import ViewReward from "./ViewReward";
import { Reward } from "@/app/_data/db-object-types";

async function RewardPage({
  params,
}: {
  params: { userPK: string; campaignId: string; rewardId: string };
}) {
  const session = await getSession();
  const reward = (await getObject(
    params.rewardId,
    `${params.userPK}/${params.campaignId}`
  )) as Reward;
  if (!reward) return <LoadingPage />;
  const userPk = reward.pk.split("/")[0];

  return !session || userPk === session.user.userPK ? (
    <EditReward reward={reward} />
  ) : (
    <ViewReward reward={reward} />
  );
}

export default RewardPage;
