"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { APIResponse } from "../_data/db-types";
import { Campaign, UserPK } from "../_data/db-uc-types";

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
        setCampaigns(result.data);
      }
    };
    getCampaigns();
  }, []);

  return (
    <div>
      <h2>Campaigns</h2>
      {!campaigns || !campaigns.length ? (
        <p>You don&apos;t have any campaigns yet.</p>
      ) : (
        campaigns.map((campaign) => (
          <div key={campaign.pk}>
            <Link href={`/${campaign.pk}/`}>
              <h3>{campaign.data.name}</h3>
            </Link>
          </div>
        ))
      )}
      <Link href="/campaigns/add">
        <Button variant="primary">Create new</Button>
      </Link>
    </div>
  );
};

export default CampaignList;
