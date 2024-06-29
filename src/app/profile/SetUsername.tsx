"use client";

import { Button, Form } from "react-bootstrap";
import { setUsername } from "./actions";
import { useFormStatus, useFormState } from "react-dom";

export interface SetUsernameFormState {
  message: string;
  validity: "valid" | "invalid" | null;
}

const INITIAL_FORM_STATE: SetUsernameFormState = {
  message: "",
  validity: null,
};

function Submit() {
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending}>
      Submit
    </Button>
  );
}

function SetUsername() {
  const [formState, formAction] = useFormState(setUsername, INITIAL_FORM_STATE);

  // const [checkingIfExists, setCheckingIfExists] = useState(false);
  // const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
  // const [lastCheckedUsername, setLastCheckedUsername] = useState("");
  // const formRef = useRef<HTMLFormElement>(null);
  // const [formValid, setFormValid] = useState(false);
  // const [helpText, setHelpText] = useState<string>("");
  // const [submitting, setSubmitting] = useState(false);

  // const isInvalid = !!username && (usernameExists === true || !formValid);
  // const isValid =
  //   !!username && !usernameExists && !checkingIfExists && formValid;

  // useEffect(() => {
  //   if (formRef.current) {
  //     const isValid = formRef.current.checkValidity();
  //     setFormValid(isValid);
  //   }
  // }, [username]);

  // useEffect(() => {
  //   if (!username) {
  //     setUsernameExists(null);
  //     return;
  //   }

  //   // if I am not yet checking if this username exists, then check
  //   if (
  //     username &&
  //     !checkingIfExists &&
  //     username !== lastCheckedUsername &&
  //     formValid
  //   ) {
  //     setHelpText("Checking if username already exists...");
  //     setCheckingIfExists(true);
  //     setUsernameExists(null);
  //     setLastCheckedUsername(username);
  //     // getUserExists(username).then((exists) => {
  //     //   if (exists) {
  //     //     setHelpText("❌ Username already exists");
  //     //   } else {
  //     //     setHelpText("✅ Username is available");
  //     //   }
  //     //   setUsernameExists(exists);
  //     //   setCheckingIfExists(false);
  //     // });
  //   }
  //   // I am already checking
  // }, [checkingIfExists, formValid, lastCheckedUsername, username]);

  return (
    <Form action={formAction}>
      <Form.Group className="mb-3">
        <Form.Label>Create a username</Form.Label>
        <Form.Control
          type="text"
          name="userPK"
          required
          minLength={3}
          maxLength={20}
          pattern="^[a-zA-Z0-9]*$"
          isInvalid={formState?.validity === "invalid"}
          isValid={formState?.validity === "valid"}
        />
      </Form.Group>
      {formState.message}
      <Submit />
    </Form>
  );
}

export default SetUsername;
