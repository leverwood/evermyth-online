import PageLayout from "../_components/PageLayout";
import { getUsernameFromSession } from "./actions";

async function ProfilePage() {
  const userPK = await getUsernameFromSession();
  if (!userPK) return null;

  return (
    <PageLayout>
      <h1>Profile</h1>
      <pre>{userPK}</pre>
    </PageLayout>
  );
}
export default ProfilePage;
