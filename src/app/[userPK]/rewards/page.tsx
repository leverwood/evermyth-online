import PageLayout from "@/app/_components/PageLayout";
import styles from "./page.module.scss";
import RewardList from "./RewardList";

const RewardsPage = async ({ params }: { params: { userPK: string } }) => {
  return (
    <PageLayout>
      <main className={styles.root}>
        <RewardList />
      </main>
    </PageLayout>
  );
};

export default RewardsPage;
