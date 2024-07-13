import { getSession } from "@auth0/nextjs-auth0";
import Navigation from "@/app/_components/nav/Navigation";
import { Campaign } from "@/app/_data/db-uc-types";

interface PageLayoutProps {
  campaign?: Campaign;
  children?: React.ReactNode;
}

const PageLayout = async ({ children, campaign }: PageLayoutProps) => {
  const session = await getSession();
  return (
    <>
      <Navigation
        userPK={session ? session.user.userPK : ""}
        campaign={campaign}
      />
      <main>{children}</main>
    </>
  );
};

export default PageLayout;
