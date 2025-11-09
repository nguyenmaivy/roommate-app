import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand
} from "@aws-sdk/client-dynamodb";

import pkg from "@aws-sdk/lib-dynamodb";
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} = pkg;

// Config
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";

// Client for DynamoDB Local
const client = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
});

const ddb = DynamoDBDocumentClient.from(client);

async function deleteTableIfExists(tableName) {
  try {
    await client.send(new DeleteTableCommand({ TableName: tableName }));
    console.log(`🗑️ Deleted existing table ${tableName}`);
  } catch (err) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`ℹ️ Table ${tableName} không tồn tại, không cần xóa`);
    } else throw err;
  }
}

async function createUsersTable() {
  try {
    await client.send(new CreateTableCommand({
      TableName: "Users",
      KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "email", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    }));
    console.log("✅ Created table Users");
  } catch (err) {
    if (err.name === "ResourceInUseException") {
      console.log("ℹ️ Table Users exists, skipping create.");
    } else throw err;
  }

  // Insert sample user
  await ddb.send(new PutCommand({
    TableName: "Users",
    Item: {
      email: "phuhuynh@test.com",
      name: "Phu",
      password: "123456",
      role: "admin",
    }
  }));
  console.log("✅ Inserted item into Users");

  const result = await ddb.send(new GetCommand({
    TableName: "Users",
    Key: { email: "phuhuynh@test.com" }
  }));
  console.log("✅ Fetched item:", result.Item);
}

async function createRoomsTable() {
  try {
    await client.send(new CreateTableCommand({
      TableName: "Rooms",
      KeySchema: [{ AttributeName: "roomId", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "roomId", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    }));
    console.log("✅ Created table Rooms");
  } catch (err) {
    if (err.name === "ResourceInUseException") {
      console.log("ℹ️ Table Rooms exists, skipping create.");
    } else throw err;
  }

  // Insert sample room
  await ddb.send(new PutCommand({
    TableName: "Rooms",
    Item: {
      roomId: "r001",
      title: "Phòng trọ mới Quận 1",
      price: "5.000.000 VNĐ/tháng",
      district: "Quận 1",
      city: "TP.HCM",
      area: "25 m²",
      amenities: ["Wifi", "Máy lạnh", "Bếp"]
    }
  }));
  console.log("✅ Inserted item into Rooms");

  const result = await ddb.send(new GetCommand({
    TableName: "Rooms",
    Key: { roomId: "r001" }
  }));
  console.log("✅ Fetched item:", result.Item);
}

async function createMessagesTable() {
  try {
    await client.send(new CreateTableCommand({
      TableName: "Messages",
      KeySchema: [{ AttributeName: "messageId", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "messageId", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    }));
    console.log("✅ Created table Messages");
  } catch (err) {
    if (err.name === "ResourceInUseException") {
      console.log("ℹ️ Table Messages exists, skipping create.");
    } else throw err;
  }
}

async function run() {
  // Xóa table trước khi tạo
  // await deleteTableIfExists("Users");
  // await deleteTableIfExists("Rooms");

  // Tạo table + insert sample
  await createUsersTable();
  await createRoomsTable();
  await createMessagesTable();
}

run().catch(console.error);
