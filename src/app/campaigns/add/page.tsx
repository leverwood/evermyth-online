"use client";

import { useAuth } from "@/app/[userPK]/useAuth";
import Unauthorized from "@/app/_components/Unauthorized";
import { Campaign } from "@/app/api/users/db-uc-types";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Alert, Button, Form } from "react-bootstrap";

const createNewCampaign = (campaign: Campaign) => {
  return fetch(`/api/campaigns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(campaign),
  });
};

function AddCampaignPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [modifiedSlug, setModifiedSlug] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!user) return;
      createNewCampaign({
        pk: `${user.pk}/${slug}`,
        data: {
          type: "campaign",
          name,
          owner: user.pk,
          rewards: [],
          pcs: [],
          creatures: [],
          shops: [],
          notes: [],
        },
      });
    },
    [name, slug, user]
  );

  // when the user manually changes the slug
  const handleSlugChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setModifiedSlug(true);
  }, []);

  useEffect(() => {
    if (!modifiedSlug) setSlug(name.toLowerCase().replace(/\s+/g, "-"));
  }, [modifiedSlug, name]);

  if (!user) return <Unauthorized />;

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Add Campaign</h1>

      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="slug">
        <Form.Label>URL</Form.Label>
        <div className="d-flex align-items-center">
          <p className="my-0">{`/${user.pk}/`}</p>
          <Form.Control type="text" value={slug} onChange={handleSlugChange} />
        </div>

        <Form.Text className="text-muted">
          {modifiedSlug ? "Modified" : "Not modified"}
        </Form.Text>
        <Alert variant="warning">
          Once this has been set, it cannot be changed
        </Alert>
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        disabled={!name || !slug || !user}
      >
        Add
      </Button>
    </Form>
  );
}

export default AddCampaignPage;
