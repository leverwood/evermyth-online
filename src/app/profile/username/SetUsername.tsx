"use client";

import { Alert, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { APIResponse } from "@/app/_data/db-types";
import { useRouter } from "next/navigation";

export interface SetUsernameFormState {}

function SetUsername() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validity, setValidity] = useState<null | "valid" | "invalid">(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
    event.preventDefault();
    const username = event.currentTarget.userPK.value;

    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });
    try {
      const result: APIResponse = await response.json();
      console.log(result);
      if (result.success) {
        router.push("/dashboard");
        return;
      } else {
        setMessage(result.message);
        setValidity("invalid");
      }
    } catch (e) {
      console.error(e);
      setMessage("An error occurred");
      setValidity("invalid");
    }

    setSubmitting(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Create a username</Form.Label>
        <Form.Control
          type="text"
          name="userPK"
          required
          minLength={3}
          maxLength={20}
          pattern="^[a-zA-Z0-9_]*$"
          isInvalid={validity === "invalid"}
          isValid={validity === "valid"}
        />
      </Form.Group>
      {message}
      <Alert variant="info">Once this is set, it cannot be changed.</Alert>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </Form>
  );
}

export default SetUsername;
