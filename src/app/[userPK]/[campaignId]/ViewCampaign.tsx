import { Campaign } from "@/app/_data/db-uc-types";

interface ViewCampaignProps {
  campaign: Campaign;
}

const ViewCampaign = ({}: ViewCampaignProps) => {
  return (
    <div>
      <h1>View Campaign</h1>
    </div>
  );
};

export default ViewCampaign;
