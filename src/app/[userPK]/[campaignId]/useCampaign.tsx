"use client";

import { Campaign } from "@/app/_data/db-uc-types";
import { createContext, useContext, useState } from "react";

interface CampaignContextProps {
  campaign: Campaign;
}

const CampaignContext = createContext<CampaignContextProps | undefined>(
  undefined
);

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error(
      "useCampaignContext must be used within a CampaignProvider"
    );
  }
  return context;
};

const fetchCampaign = async (
  userPK: string,
  campaignId: string
): Promise<Campaign> => {
  const response = await fetch(`/api/${userPK}/${campaignId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch campaign");
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error("Failed to fetch campaign");
  }
  return result.data;
};

export const CampaignProvider = ({
  children,
  campaignInitialData,
}: {
  campaignInitialData: Campaign;
  children: React.ReactNode;
}) => {
  const [campaign, setCampaign] = useState<Campaign>(campaignInitialData);

  return (
    <CampaignContext.Provider value={{ campaign }}>
      {children}
    </CampaignContext.Provider>
  );
};
