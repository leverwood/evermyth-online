import { Reward } from "@/app/_data/db-object-types";

interface ViewRewardProps {
  reward: Reward;
}

const ViewReward = ({}: ViewRewardProps) => {
  return (
    <div>
      <h1>View Reward</h1>
    </div>
  );
};

export default ViewReward;
