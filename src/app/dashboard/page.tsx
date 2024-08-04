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
    <PageLayout className={styles.pageLayout}>
      <div className={styles.content}>
        <DashboardTitle userPK={session.user.userPK} />
        <Suspense fallback={<div>Loading...</div>}>
          <CampaignList />
        </Suspense>
      </div>
    </PageLayout>
  );
}
export default DashboardPage;
