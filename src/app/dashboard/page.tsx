import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import DashboardTitle from "./DashboardTitle";
import CampaignList from "./CampaignList";
import PageLayout from "../_components/PageLayout";
import styles from "./page.module.scss";

async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <PageLayout className={styles.pageLayout} size="full">
      <DashboardTitle userPK={session.user.userPK} />
      <div className={styles.body}>
        <div className={styles.content}>
          <Suspense fallback={<div>Loading...</div>}>
            <CampaignList />
          </Suspense>
        </div>
      </div>
    </PageLayout>
  );
}
export default DashboardPage;
