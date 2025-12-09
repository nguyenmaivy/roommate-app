import jwt from "jsonwebtoken";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

let ddb;
export const __setDocumentClient = (client) => {
  ddb = client;
};

const USERS_TABLE = "Users";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const meUserHandler = async (req) => {
  // ✅ Lấy cookie từ header
  const token = req.cookies?.token;

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Not authenticated" }),
    };
  }

  try {
    // ✅ Decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    if (!ddb) {
      const { DynamoDBClient } = await import("@aws-sdk/client-dynamodb");
      const { DynamoDBDocumentClient } = await import("@aws-sdk/lib-dynamodb");

      const client = new DynamoDBClient({
        region: "us-east-1",
        endpoint: "http://localhost:8000",
        credentials: { accessKeyId: "fake", secretAccessKey: "fake" },
      });

      ddb = DynamoDBDocumentClient.from(client);
    }

    // ✅ Lấy user từ DynamoDB
    const result = await ddb.send(
      new GetCommand({ TableName: USERS_TABLE, Key: { email } })
    );

    const user = result.Item;

    if (!user) {
      return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      }),
    };
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid token" }),
    };
  }
};
