import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const AMENITIES_TABLE = "Amenities";

let ddb;
export const __setDocumentClient = (client) => { ddb = client; };

export const getAmenities = async () => {
  try {
    const result = await ddb.send(
      new ScanCommand({
        TableName: AMENITIES_TABLE,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ data: result.Items || [] })
    };

  } catch (err) {
    console.error("Scan Amenities lỗi:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
