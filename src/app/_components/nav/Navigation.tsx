"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { autoUpdate, useFloating, shift } from "@floating-ui/react";

import styles from "./Navigation.module.scss";
import Logo from "./logo.svg";
import LogoText from "./logo-text.svg";
import Button from "@/app/_components/Button";
import { Campaign } from "@/app/_data/db-uc-types";
import UserIcon from "./user.svg";
import CaretDown from "@/app/_components/icons/caret-down.svg";

function CampaignLinkList({ campaignPK }: { campaignPK: string }) {
  return (
    <div className={`${styles.campaignLinkList}`}>
      <Link
        className={`${styles.campaignLink}`}
        href={`/${campaignPK}/rewards`}
      >
        Rewards
      </Link>
      <Link
        className={`${styles.campaignLink}`}
        href={`/${campaignPK}/characters`}
      >
        Players
      </Link>
      <Link className={`${styles.campaignLink}`} href={`/${campaignPK}/shops`}>
        Shops
      </Link>
      <Link className={`${styles.campaignLink}`} href={`/${campaignPK}/map`}>
        Map
      </Link>
    </div>
  );
}

function CampaignBar({ campaign }: { campaign: Campaign }) {
  const [showList, setShowList] = useState(false);
  return (
    <div className={`${styles.campaignBar} ${showList ? styles.showList : ""}`}>
      <Link className={`${styles.campaignName}`} href={`/${campaign.pk}`}>
        {campaign.data.name}
      </Link>
      <CampaignLinkList campaignPK={campaign.pk} />
      <button
        className={`${styles.expandCampaignBar}`}
        onClick={() => setShowList(!showList)}
      >
        <CaretDown className={`${styles.caretDown}`} />
      </button>
    </div>
  );
}

function Navigation({
  userPK,
  campaign,
}: {
  userPK?: string;
  campaign?: Campaign;
}) {
  const { user, isLoading } = useUser();
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [shift()],
  });
  const showUser = isLoading ? userPK : (user?.userPK as string);
  const [showNavLinks, setShowNavLinks] = useState(false);

  return (
    <nav
      className={`${styles.root} ${showNavLinks ? styles.showNavLinks : ""}`}
    >
      <div className={`${styles.container}`}>
        <Link href={"/"} className={`${styles.logoLink}`}>
          <Logo className={`${styles.logo}`} />
          {!campaign && <LogoText className={`${styles.logoText}`} />}
        </Link>
        {campaign && <CampaignBar campaign={campaign} />}
        <button
          ref={refs.setReference}
          className={styles.hamburger}
          onClick={() => setShowNavLinks(!showNavLinks)}
        >
          <UserIcon className={styles.userIcon} />
          <span className={styles.username}>{showUser}</span>
        </button>
        {showNavLinks && (
          <div
            className={`${styles.linkWell}`}
            ref={refs.setFloating}
            style={floatingStyles}
          >
            {showUser ? (
              <>
                <Link href="/profile">Profile</Link>
                <Link href="/api/auth/logout">Logout</Link>
              </>
            ) : (
              <Button className={styles.navButton} href="/api/auth/login">
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
