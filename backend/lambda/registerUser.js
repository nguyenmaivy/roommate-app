import bcrypt from "bcryptjs";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

let ddb; // Injected DynamoDBDocumentClient

export const __setDocumentClient = (client) => {
  ddb = client;
};

const USERS_TABLE = "Users";

export const handler = async (event) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const { email, password, name, contact_phone } = body;

  if (!email || !password || !name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email, password, and name are required" }),
    };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      userId: uuidv4(),
      email,
      password: passwordHash,
      name,
      role: "STUDENT",
      phone: contact_phone,
    };

    await ddb.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
        ConditionExpression: "attribute_not_exists(email)", // tránh duplicate email
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User registered successfully",
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
    };
  } catch (err) {
    console.error("❌ Register error:", err);

    return {
      statusCode: err.name === "ConditionalCheckFailedException" ? 409 : 500,
      body: JSON.stringify({
        error: err.name === "ConditionalCheckFailedException"
          ? "Email already exists"
          : err.message,
      }),
    };
  }
};
