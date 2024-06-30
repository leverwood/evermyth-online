import { getUsernameFromSession } from "./actions";

async function ProfilePage() {
  const userPK = await getUsernameFromSession();
  if (!userPK) return null;

  return (
    <div>
      <h1>Profile</h1>
      <pre>{userPK}</pre>
    </div>
  );
}
export default ProfilePage;
