import bcrypt from "bcryptjs";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

let ddb; // Injected DynamoDBDocumentClient

export const __setDocumentClient = (client) => {
  ddb = client;
};

const USERS_TABLE = "Users";

export const handler = async (event) => {
  // fallback nếu chưa patch
  if (!ddb) {
    const { DynamoDBClient } = await import("@aws-sdk/client-dynamodb");
    const { DynamoDBDocumentClient } = await import("@aws-sdk/lib-dynamodb");

    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
      credentials: {
        accessKeyId: "fake",
        secretAccessKey: "fake",
      },
    });

    ddb = DynamoDBDocumentClient.from(client);
    console.log("⚠️ Using fallback DynamoDBDocumentClient!");
  }

  let body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email, password, and name are required" }),
    };
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await ddb.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: { email, password: hashed, name },
        ConditionExpression: "attribute_not_exists(email)", // tránh trùng email
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User registered successfully" }),
    };
  } catch (err) {
    console.error("📩 Register error:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          err.name === "ConditionalCheckFailedException"
            ? "Email already exists"
            : err.message,
      }),
    };
  }
};
