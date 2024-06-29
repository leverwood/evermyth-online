import dynamoDB from "@/utils/aws";
import { TABLE_SUB_USER } from "@/app/_data/api-constants";
import { SubUserPK } from "@/app/_data/db-uc-types";

export const putSubUserMap = async (sub: SubUserPK) => {
  console.log(`putSubUserMap`, sub);
  if (!sub.sub) {
    throw new Error("No sub provided");
  }
  const putParams = {
    TableName: TABLE_SUB_USER,
    Item: sub,
  };
  await dynamoDB.put(putParams);

  return true;
};

export async function getSubUser(sub: string): Promise<SubUserPK | undefined> {
  const fetchResult = await dynamoDB.get({
    TableName: TABLE_SUB_USER,
    Key: {
      sub,
    },
  });
  return fetchResult.Item ? (fetchResult.Item as SubUserPK) : undefined;
}

export async function deleteSubUser(sub: string) {
  console.log(`deleteSubUser`, sub);
  await dynamoDB.delete({
    TableName: TABLE_SUB_USER,
    Key: {
      sub,
    },
  });
}
