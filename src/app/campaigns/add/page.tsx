import { AppRouterPageRoute, withPageAuthRequired } from "@auth0/nextjs-auth0";
import AddCampaign from "./AddCampaign";
import PageLayout from "@/app/_components/PageLayout";

const AddCampaignPage: AppRouterPageRoute = async () => {
  return (
    <PageLayout>
      <AddCampaign />
    </PageLayout>
  );
};

export default withPageAuthRequired(AddCampaignPage, {
  returnTo: "/",
});
