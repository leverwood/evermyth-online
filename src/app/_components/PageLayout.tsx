import { getSession } from "@auth0/nextjs-auth0";
import Navigation from "@/app/_components/nav/Navigation";
import { Campaign } from "@/app/_data/db-uc-types";
import styles from "./PageLayout.module.scss";
import cx from "classnames";

interface PageLayoutProps {
  campaign?: Campaign;
  children?: React.ReactNode;
  className?: string;
}

const PageLayout = async ({
  children,
  campaign,
  className,
}: PageLayoutProps) => {
  const session = await getSession();
  return (
    <div className={styles.body}>
      <Navigation
        userPK={session ? session.user.userPK : ""}
        campaign={campaign}
      />
      <main className={cx(className, styles.main)}>{children}</main>
    </div>
  );
};

export default PageLayout;
