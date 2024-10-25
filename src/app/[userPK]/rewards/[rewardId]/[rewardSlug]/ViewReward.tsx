import { Reward } from "@/app/_data/db-reward-types";

interface ViewRewardProps {
  reward: Reward;
}

const ViewReward = ({ reward }: ViewRewardProps) => {
  return (
    <div>
      <h1>{reward.data.name}</h1>
    </div>
  );
};

export default ViewReward;
