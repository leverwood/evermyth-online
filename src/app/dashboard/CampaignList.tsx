"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import Button from "@/app/_components/Button";
import { APIResponse } from "../_data/db-types";
import { Campaign, UserPK } from "../_data/db-uc-types";
import styles from "./CampaignList.module.scss";
import CardImage from "../_components/CardImage";

interface CampaignListProps {}

const fetchCampaigns = async (): Promise<APIResponse> => {
  const response = await fetch(`/api/campaigns`, {
    next: {
      tags: ["campaigns"],
    },
  });
  try {
    return await response.json();
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred",
      data: null,
    };
  }
};

const CampaignList = ({}: CampaignListProps) => {
  const [campaigns, setCampaigns] = useState<null | Campaign[]>(null);

  useEffect(() => {
    const getCampaigns = async () => {
      const result = await fetchCampaigns();
      if (result.success) {
        setCampaigns(result.data || []);
      }
    };
    getCampaigns();
  }, []);

  return (
    <div>
      <h2 className={styles.title}>
        <span>Campaigns</span>
        <Button variant="primary" href="/campaigns/add">
          Create new
        </Button>
      </h2>
      <div className={styles.campaigns}>
        {!campaigns ? (
          <p>Loading...</p>
        ) : !campaigns.length ? (
          <p>You don&apos;t have any campaigns yet.</p>
        ) : (
          campaigns.map((campaign) => (
            <div className={styles.campaign} key={campaign.pk}>
              <Link className={styles.campaignLink} href={`/${campaign.pk}/`}>
                <CardImage src={campaign.data.image} alt={campaign.data.name} />
                <h3>{campaign.data.name}</h3>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignList;
