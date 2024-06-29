import { getSession } from "@auth0/nextjs-auth0";
import { getUser } from "../_data/dbaccess-user";

async function ProfilePage() {
  // const session = await getSession();
  // if (!session) return null;
  // const user = await getUser(session.user.userPK);
  return (
    <div>
      <h1>Profile</h1>
      <pre>{JSON.stringify({}, null, 2)}</pre>
    </div>
  );
}
export default ProfilePage;
