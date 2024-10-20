import { getSession } from "@auth0/nextjs-auth0";
import Navigation from "@/app/_components/nav/Navigation";
import { Campaign } from "@/app/_data/db-uc-types";
import styles from "./PageLayout.module.scss";
import cx from "classnames";

export type PAGE_SIZE = "small" | "medium" | "large" | "full";

interface PageLayoutProps {
  campaign?: Campaign;
  children?: React.ReactNode;
  className?: string;
  size?: PAGE_SIZE;
}

const PageLayout = async ({
  children,
  campaign,
  className,
  size = "full",
}: PageLayoutProps) => {
  const session = await getSession();
  return (
    <div className={cx(styles.body, size)}>
      <Navigation
        userPK={session ? session.user.userPK : ""}
        campaign={campaign}
      />
      <main className={cx(className, styles.main)}>{children}</main>
    </div>
  );
};

export default PageLayout;
