import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

let ddb;

export const __setDocumentClient = (client) => {
  ddb = client;
};

const USERS_TABLE = "Users";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const handler = async (event) => {
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

  let body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const { email, password } = body;

  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: "Email and password required" }) };
  }

  try {
    const result = await ddb.send(new GetCommand({ TableName: USERS_TABLE, Key: { email } }));
    const user = result.Item;
    if (!user) return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return { statusCode: 401, body: JSON.stringify({ error: "Invalid password" }) };

    // Tạo JWT
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    // Trả về cookie HTTP-only
    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Login successful", user: { email: user.email, name: user.name, role: user.role } }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
