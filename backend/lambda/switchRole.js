import jwt from "jsonwebtoken";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

let ddb;
export const __setDocumentClient = (client) => {
  ddb = client;
};

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const switchRoleHandler = async (event) => {
  try {
    const token = event.cookies?.token;
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Not authenticated" }),
      };
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    const newRole = decoded.role === "STUDENT" ? "LANDLORD" : "STUDENT";

    // ✅ FIX reserved keyword "role"
    await ddb.send(
      new UpdateCommand({
        TableName: "Users",
        Key: { email },
        UpdateExpression: "SET #role = :r",
        ExpressionAttributeNames: { "#role": "role" },
        ExpressionAttributeValues: { ":r": newRole },
      })
    );

    const newToken = jwt.sign(
      { email, name: decoded.name, role: newRole },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `token=${newToken}; HttpOnly; Path=/; SameSite=Lax;`,
      },
      body: JSON.stringify({ message: "Role switched successfully", role: newRole }),
    };
  } catch (err) {
    console.error("🔥 Error switching role:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export default switchRoleHandler;
