import { Campaign } from "@/app/_data/db-uc-types";
import styles from "./ViewCampaign.module.scss";

interface ViewCampaignProps {
  campaign: Campaign;
}

const ViewCampaign = ({}: ViewCampaignProps) => {
  return (
    <main className={styles.root}>
      <h1>View Campaign</h1>
    </main>
  );
};

export default ViewCampaign;
