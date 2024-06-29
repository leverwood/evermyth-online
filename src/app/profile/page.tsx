import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { getUser } from "./dbaccess-user";
import SetUsername from "./SetUsername";

async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }
  if (!session.user.userPK) {
    return <SetUsername />;
  }
  const user = await getUser(session.user.userPK);
  return (
    <div>
      <h1>Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
export default ProfilePage;
