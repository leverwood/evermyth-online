"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import Button from "@/app/_components/Button";
import styles from "./RewardList.module.scss";
import { APIResponse } from "@/app/_data/db-types";
import { Reward } from "@/app/_data/db-reward-types";
import { slugify } from "@/app/_lib/slugify";

interface RewardListProps {}

const fetchRewards = async (): Promise<APIResponse> => {
  const response = await fetch(`/api/rewards`, {
    next: {
      tags: ["rewards"],
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

const RewardList = ({}: RewardListProps) => {
  const [rewards, setRewards] = useState<null | Reward[]>(null);

  useEffect(() => {
    const getRewards = async () => {
      const result = await fetchRewards();
      if (result.success) {
        setRewards(result.data || []);
      }
    };
    getRewards();
  }, []);

  return (
    <div>
      <h2 className={styles.title}>
        <span>Rewards</span>
        <Button variant="primary" href="/rewards/add">
          Create new
        </Button>
      </h2>
      <div className={styles.rewards}>
        {!rewards ? (
          <p>Loading...</p>
        ) : !rewards.length ? (
          <p>You don&apos;t have any rewards yet.</p>
        ) : (
          rewards.map((reward) => (
            <div className={styles.reward} key={reward.pk}>
              <Link
                className={styles.rewardLink}
                href={`/${reward.userPK}/rewards/${reward.pk}/${slugify(
                  reward.data.name
                )}/edit`}
              >
                <h3>{reward.data.name}</h3>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RewardList;
