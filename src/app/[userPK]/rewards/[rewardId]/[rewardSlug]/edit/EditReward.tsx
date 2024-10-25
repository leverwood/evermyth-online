"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Alert, Button } from "react-bootstrap";

import PageTitle from "@/app/_components/PageTitle";
import { APIResponse } from "@/app/_data/db-types";
import styles from "./EditReward.module.scss";
import { Reward } from "@/app/_data/db-reward-types";

interface EditRewardProps {
  reward: Reward;
}

const deleteRewardFetch = async (pk: string): Promise<APIResponse> => {
  const response = await fetch(`/api/rewards/${pk}`, {
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

const EditReward = ({ reward }: EditRewardProps) => {
  const [message, setMessage] = useState("");
  const [validity, setValidity] = useState<null | "valid" | "invalid">(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    setValidity(null);
    setSubmitting(true);

    const result = await deleteRewardFetch(reward.pk);
    if (result.success) {
      // redirect to the user's rewards page
      router.push(`/${reward.userPK}/rewards`);
      return;
    } else {
      setMessage(result.message);
      setValidity("invalid");
    }

    setSubmitting(false);
  }, [reward.pk, reward.userPK, router]);

  return (
    <main className={styles.root}>
      <PageTitle title={reward.data.name} />
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

export default EditReward;
