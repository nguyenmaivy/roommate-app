import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

let ddb;

// Inject DynamoDBDocumentClient
export const __setDocumentClient = (client) => {
  ddb = client;
};

const USERS_TABLE = "Users";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const handler = async (event) => {
  try {
    const body =
      typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body;

    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email and password required" }),
      };
    }

    const result = await ddb.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { email },
      })
    );

    const user = result.Item;

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    if (!user.password) {
      console.error("❌ User exists but has NO password field:", user);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "User data corrupted – missing password",
        }),
      };
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid password" }),
      };
    }

    const token = jwt.sign(
      {
        email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("✅ Login successful:", user);

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Login successful",
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
      }),
    };
  } catch (err) {
    console.error("🔥 Login error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
