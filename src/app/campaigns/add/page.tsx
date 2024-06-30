import { AppRouterPageRoute, withPageAuthRequired } from "@auth0/nextjs-auth0";
import AddCampaign from "./AddCampaign";

const AddCampaignPage: AppRouterPageRoute = async () => {
  return <AddCampaign />;
};

export default withPageAuthRequired(AddCampaignPage, {
  returnTo: "/",
});
