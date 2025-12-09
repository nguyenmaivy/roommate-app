import { v4 as uuidv4 } from "uuid";
import { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

let ddb;
export const __setDocumentClient = (client) => { ddb = client; };

const ROOMS_TABLE = "Rooms";

// CREATE
export const createRoom = async (event) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  const {
    title,
    price,
    address,
    area,
    amenities,
    landlordId,
    description,
    imageUrl,
  } = body;

  if (!title || !price || !address || !area) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" }),
    };
  }

  const id = uuidv4(); // ✅ Dùng key "id" đúng với DynamoDB

  const item = {
    id,
    title,
    price,
    address,
    area,
    amenities: amenities || [],
    landlordId: landlordId || "unknown",
    description: description || "",
    imageUrl: imageUrl || "",
    createdAt: new Date().toISOString(),
  };

  try {
    await ddb.send(
      new PutCommand({
        TableName: ROOMS_TABLE,
        Item: item,
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Room created",
        room: item,
      }),
    };
  } catch (err) {
    console.error("❌ DynamoDB Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

// READ ALL
export const getRooms = async () => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: ROOMS_TABLE }));
    return { statusCode: 200, body: JSON.stringify({ rooms: result.Items || [] }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// READ ONE
export const getRoom = async (event) => {
  const { roomId } = event.params || event.pathParameters || {};

  if (!roomId)
    return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };

  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: ROOMS_TABLE,
        Key: { id: roomId }, // ✅ PK đúng
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ room: result.Item }),
    };
  } catch (err) {
    console.error("❌ GET room error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};


// UPDATE
export async function updateRoom(roomId, body) {
  console.log("Updating room:", body);
  const { title, price, address, area, amenities, landlordId, description, imageUrl } = body;

  const params = {
    TableName: ROOMS_TABLE,
    Key: { id: roomId },
    UpdateExpression: `
      set 
        title = :t,
        price = :p,
        address = :addr,
        area = :a,
        amenities = :am,
        landlordId = :l,
        description = :desc,
        imageUrl = :img
    `,
    ExpressionAttributeValues: {
      ":t": title,
      ":p": price,
      ":addr": address,
      ":a": area,
      ":am": amenities || [],
      ":l": landlordId,
      ":desc": description,
      ":img": imageUrl,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await ddb.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ Room updated successfully",
        room: result.Attributes,
      }),
    };
  } catch (err) {
    console.error("❌ DynamoDB Update Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}


// DELETE
export const deleteRoom = async (event) => {
  const { roomId } = event.params || event.pathParameters || {};

  if (!roomId)
    return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };

  try {
    await ddb.send(
      new DeleteCommand({
        TableName: ROOMS_TABLE,
        Key: { id: roomId }, // ✅ PK đúng
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Room deleted" }),
    };
  } catch (err) {
    console.error("❌ DELETE room error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

