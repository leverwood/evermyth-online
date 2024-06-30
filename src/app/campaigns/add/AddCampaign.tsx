"use client";

import { APIResponse } from "@/app/_data/db-types";
import { Campaign } from "@/app/_data/db-uc-types";
import { useRouter } from "next/navigation";
import { useState, useCallback, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";

const createNewCampaign = async (
  campaign: Omit<Campaign, "pk">
): Promise<APIResponse> => {
  const response = await fetch(`/api/campaigns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(campaign),
  });
  return await response.json();
};

const AddCampaign = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitting(true);
      const result = await createNewCampaign({
        data: {
          type: "campaign",
          name,
          rewards: [],
          pcs: [],
          creatures: [],
          shops: [],
          notes: [],
        },
      });

      if (!result.success) {
        setMessage(result.message);
        setSubmitting(false);
      } else {
        const pk = result.data.pk;
        router.push(`/${pk}`);
      }
    },
    [name, router]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Add Campaign</h1>

      <Form.Group controlId="name">
        <Form.Control
          type="text"
          name="campaign-title"
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
export default AddCampaign;
