import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
} from "@aws-sdk/client-dynamodb";

import pkg from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
const { DynamoDBDocumentClient, PutCommand } = pkg;

// ===== IMPORT MOCK DATA =====
import { AMENITIES, MOCK_ROOMS } from "../frontend/mockData.js";

// ===== CONFIG =====
const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
});

const ddb = DynamoDBDocumentClient.from(client);

// ===== UTIL: DELETE TABLE IF EXISTS =====
async function deleteTableIfExists(tableName) {
  try {
    await client.send(new DeleteTableCommand({ TableName: tableName }));
    console.log(`🗑️ Deleted table ${tableName}`);
  } catch (err) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`ℹ️ ${tableName} does not exist, skip delete.`);
      return;
    }
    throw err;
  }
}

// ===== CREATE TABLE USERS =====
async function createUsersTable() {
  await client.send(
    new CreateTableCommand({
      TableName: "Users",
      KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "email", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST"
    })
  );
  console.log("✅ Created table: Users");

  await ddb.send(
    new PutCommand({
      TableName: "Users",
      Item: {
        email: "phuhuynh.010104@gmail.com",        // ✅ Bắt buộc phải có key email
        name: "Admin",
        password: await bcrypt.hash("123456", 10),
        role: "admin",
      },
    })
  );

  console.log("✅ Inserted INITIAL_USER");
}

// ===== CREATE TABLE ROOMS =====
async function createRoomsTable() {
  await client.send(
    new CreateTableCommand({
      TableName: "Rooms",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );

  console.log("✅ Created table: Rooms");

  for (const room of MOCK_ROOMS) {
    await ddb.send(
      new PutCommand({
        TableName: "Rooms",
        Item: room,
      })
    );
  }

  console.log("✅ Inserted MOCK_ROOMS into Rooms");
}

// ===== CREATE TABLE AMENITIES =====
async function createAmenitiesTable() {
  await client.send(
    new CreateTableCommand({
      TableName: "Amenities",
      KeySchema: [{ AttributeName: "key", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "key", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );

  console.log("✅ Created table: Amenities");

  for (const amenity of AMENITIES) {
    await ddb.send(
      new PutCommand({
        TableName: "Amenities",
        Item: amenity,
      })
    );
  }

  console.log("✅ Inserted AMENITIES into Amenities table");
}

// ===== RUN ALL =====
async function initDB() {
  console.log("🚀 Initializing DynamoDB Local...");

  await deleteTableIfExists("Users");
  await deleteTableIfExists("Rooms");
  await deleteTableIfExists("Amenities");

  await createUsersTable();
  await createRoomsTable();
  await createAmenitiesTable();

  console.log("🎉 All tables created and mock data inserted.");
}

initDB().catch(console.error);