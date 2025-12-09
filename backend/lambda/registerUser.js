import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

let ddb;

export const __setDocumentClient = (client) => {
  ddb = client;
};

const USERS_TABLE = "Users";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const handler = async (event) => {
<<<<<<< HEAD
  const body =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  const { email, password, name } = body;
=======
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const { email, password, name, contact_phone } = body;
>>>>>>> main

  if (!email || !password || !name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email, password and name are required" }),
    };
  }

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      userId: uuidv4(),
      email,
      password: passwordHash,
      name,
      role: "STUDENT",
      phone: contact_phone,
    };

    // Save user
    await ddb.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
        ConditionExpression: "attribute_not_exists(email)", // tránh trùng email
      })
    );

    // Create JWT token
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "User registered successfullyy",
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
        error:
          err.name === "ConditionalCheckFailedException"
            ? "Email already exists"
            : err.message,
      }),
    };
  }
};
