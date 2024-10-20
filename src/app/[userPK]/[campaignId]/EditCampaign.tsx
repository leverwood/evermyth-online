"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Alert, Button } from "react-bootstrap";

import PageTitle from "@/app/_components/PageTitle";
import { APIResponse } from "@/app/_data/db-types";
import { Campaign } from "@/app/_data/db-uc-types";
import styles from "./EditCampaign.module.scss";

interface EditCampaignProps {
  campaign: Campaign;
}

const deleteCampaignFetch = async (pk: string): Promise<APIResponse> => {
  const response = await fetch(`/api/${pk}`, {
    method: "DELETE",
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

const EditCampaign = ({ campaign }: EditCampaignProps) => {
  const [message, setMessage] = useState("");
  const [validity, setValidity] = useState<null | "valid" | "invalid">(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    setValidity(null);
    setSubmitting(true);

    const result = await deleteCampaignFetch(campaign.pk);
    if (result.success) {
      // redirect to the user's page
      router.push(`/dashboard`);
      return;
    } else {
      setMessage(result.message);
      setValidity("invalid");
    }

    setSubmitting(false);
  }, [campaign.pk, router]);

  return (
    <main className={styles.root}>
      <PageTitle title={campaign.data.name} />
      {message && (
        <Alert variant={validity === "invalid" ? "danger" : "info"}>
          {message}
        </Alert>
      )}
      <Button variant="danger" onClick={handleDelete} disabled={submitting}>
        {submitting ? "Deleting..." : "Delete"}
      </Button>
    </main>
  );
};

export default EditCampaign;
