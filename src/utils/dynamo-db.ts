import { DocumentClient } from "aws-sdk/clients/dynamodb";
import dynamoDB from "./aws";

const tableName = "UsersCampaigns";

// Function to get a campaign by user ID and campaign ID
export const getCampaign = async (userId: string, campaignId: string) => {
  const params = {
    TableName: tableName,
    Key: {
      userId: userId,
      campaignId: campaignId,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error("Error getting campaign:", error);
    throw new Error("Could not get campaign");
  }
};

// Function to add a new campaign
export const addCampaign = async (campaign: any) => {
  const params: DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: campaign,
  };

  try {
    await dynamoDB.put(params).promise();
    return campaign;
  } catch (error) {
    console.error("Error adding campaign:", error);
    throw new Error("Could not add campaign");
  }
};

// Function to update a campaign
export const updateCampaign = async (
  userId: string,
  campaignId: string,
  updateData: any
) => {
  const params = {
    TableName: tableName,
    Key: {
      userId: userId,
      campaignId: campaignId,
    },
    UpdateExpression: "set #data = :data",
    ExpressionAttributeNames: {
      "#data": "data", // Adjust this based on your attribute names
    },
    ExpressionAttributeValues: {
      ":data": updateData,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw new Error("Could not update campaign");
  }
};

// Function to delete a campaign
export const deleteCampaign = async (userId: string, campaignId: string) => {
  const params = {
    TableName: tableName,
    Key: {
      userId: userId,
      campaignId: campaignId,
    },
  };

  try {
    await dynamoDB.delete(params).promise();
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw new Error("Could not delete campaign");
  }
};
