"use client";

import { Reward } from "@/app/_data/db-reward-types";
import { APIResponse } from "@/app/_data/db-types";
import { slugify } from "@/app/_lib/slugify";
import { useRouter } from "next/navigation";
import { useState, useCallback, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";

const createNewReward = async (
  reward: Omit<Omit<Reward, "pk">, "userPK">
): Promise<APIResponse> => {
  const response = await fetch(`/api/rewards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reward),
  });
  return await response.json();
};

const AddReward = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitting(true);
      const result = await createNewReward({
        type: "reward",
        data: {
          name,
        },
      });

      if (!result.success) {
        setMessage(result.message);
        setSubmitting(false);
      } else {
        const pk = result.data.pk;
        router.push(
          `/${result.data.userPK}/rewards/${pk}/${slugify(result.data.name)}`
        );
      }
    },
    [name, router]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Add Reward</h1>

      <Form.Group controlId="name">
        <Form.Control
          type="text"
          name="reward-title"
          value={name}
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <p>{message}</p>

      <Button variant="primary" type="submit" disabled={!name || submitting}>
        Add
      </Button>
    </Form>
  );
};
export default AddReward;
