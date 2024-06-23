"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/app/[user]/useAuth";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import Unauthorized from "../_components/Unauthorized";
import LoadingPage from "../_components/LoadingPage";

function Profile() {
  const { user, loggedIn, isLoadingAuth } = useAuth();

  if (!user) {
    if (loggedIn === false) {
      return <Unauthorized />;
    }
    if (isLoadingAuth) {
      return <LoadingPage />;
    }
    return null;
  }

  if (!user.pk) {
    return <SetUsername />;
  }

  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}

async function getUserExists(username: string) {
  const result = await fetch(`/api/users/exists?username=${username}`).then(
    (res) => res.json()
  );

  // TODO: handle errors

  return result.data.usernameExists;
}

function SetUsername() {
  const { createUsername } = useAuth();
  const [username, setUsername] = useState("");
  const [checkingIfExists, setCheckingIfExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
  const [lastCheckedUsername, setLastCheckedUsername] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [formValid, setFormValid] = useState(false);
  const [helpText, setHelpText] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const isInvalid = !!username && (usernameExists === true || !formValid);
  const isValid =
    !!username && !usernameExists && !checkingIfExists && formValid;

  useEffect(() => {
    if (formRef.current) {
      const isValid = formRef.current.checkValidity();
      setFormValid(isValid);
    }
  }, [username]);

  useEffect(() => {
    if (!username) {
      setUsernameExists(null);
      return;
    }

    // if I am not yet checking if this username exists, then check
    if (
      username &&
      !checkingIfExists &&
      username !== lastCheckedUsername &&
      formValid
    ) {
      setHelpText("Checking if username already exists...");
      setCheckingIfExists(true);
      setUsernameExists(null);
      setLastCheckedUsername(username);
      getUserExists(username).then((exists) => {
        if (exists) {
          setHelpText("❌ Username already exists");
        } else {
          setHelpText("✅ Username is available");
        }
        setUsernameExists(exists);
        setCheckingIfExists(false);
      });
    }
    // I am already checking
  }, [checkingIfExists, formValid, lastCheckedUsername, username]);

  const handleOnSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      createUsername(username);
    },
    [createUsername, username]
  );

  return (
    <Form ref={formRef} onSubmit={handleOnSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Create a username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          maxLength={20}
          pattern="^[a-zA-Z0-9]*$"
          title="Username must be alphanumeric"
          isInvalid={isInvalid}
          isValid={isValid}
        />
      </Form.Group>
      <Form.Text className={isInvalid ? "text-danger" : "text-muted"}>
        {!formValid
          ? "Username must be alphanumeric and between 3 and 20 characters"
          : helpText}
      </Form.Text>
      <Alert variant="warning">
        Once this has been set, it cannot be changed
      </Alert>
      <Button variant="primary" type="submit" disabled={!isValid || submitting}>
        {submitting ? "Creating User" : "Submit"}
      </Button>
    </Form>
  );
}

export default Profile;
