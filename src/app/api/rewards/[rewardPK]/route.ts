import { getSession } from "@auth0/nextjs-auth0";
import {
  RESPOND_OK,
  RESPOND_UNAUTHORIZED,
  respondServerError,
} from "../../api-constants";
import { deleteReward } from "@/app/_data/rewards-dto";

export async function DELETE(
  request: Request,
  { params }: { params: { rewardPK: string } }
) {
  console.log(`delete reward`, params.rewardPK);
  const session = await getSession();
  if (!session) {
    return RESPOND_UNAUTHORIZED;
  }

  // delete the campaign
  try {
    await deleteReward(params.rewardPK, session.user.userPK);
  } catch (e) {
    console.error(e);
    return respondServerError("Error deleting reward", params.rewardPK);
  }
  return RESPOND_OK;
}
