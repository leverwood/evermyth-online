import { AppRouterPageRoute, withPageAuthRequired } from "@auth0/nextjs-auth0";
import AddReward from "./AddReward";
import PageLayout from "@/app/_components/PageLayout";

const AddRewardPage: AppRouterPageRoute = async () => {
  return (
    <PageLayout>
      <AddReward />
    </PageLayout>
  );
};

export default withPageAuthRequired(AddRewardPage, {
  returnTo: "/",
});
