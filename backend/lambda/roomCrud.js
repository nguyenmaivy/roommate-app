import { v4 as uuidv4 } from "uuid";
import { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

let ddb;
export const __setDocumentClient = (client) => { ddb = client; };

const ROOMS_TABLE = "Rooms";

const formatDate = () => {
  const d = new Date();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${hh}:${mm} ${day}/${month}/${year}`;
};

// ✅ CREATE ROOM
export const createRoom = async (event) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  const {
    title,
    rental_type,
    price,
    address,
    area,
    amenities,
    landlordId,
    description,
    imageUrl,
    location, // { lat, lng }
  } = body;

  if (!title || !price || !address || !area || !location) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing required fields", 
        title,
        price,
        address,
        area,
        location,
      }),
    };
  }

  const id = uuidv4();

  const item = {
    id,
    title,
    rental_type: rental_type || "Cho thuê phòng trọ",
    date: formatDate(),
    address,
    price,
    area,
    amenities: Array.isArray(amenities) ? amenities : [],
    landlordId: landlordId || "unknown",
    description: description || "",
    imageUrl: Array.isArray(imageUrl) ? imageUrl : [],
    location, // { lat, lng }
    date: new Date().toISOString(),
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

// ✅ READ ALL
export const getRooms = async () => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: ROOMS_TABLE }));
    return { statusCode: 200, body: JSON.stringify({ rooms: result.Items || [] }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// ✅ READ ONE
export const getRoom = async (event) => {
  const { roomId } = event.params || event.pathParameters || {};

  if (!roomId)
    return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };

  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: ROOMS_TABLE,
        Key: { id: roomId },
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

// ✅ UPDATE
export async function updateRoom(roomId, body) {
  const {
    title,
    rental_type,
    price,
    address,
    area,
    amenities,
    landlordId,
    description,
    imageUrl,
    location,
  } = body;

  const params = {
    TableName: ROOMS_TABLE,
    Key: { id: roomId },
    UpdateExpression: `
      SET 
        title = :t,
        rental_type = :rt,
        price = :p,
        address = :addr,
        area = :a,
        amenities = :am,
        landlordId = :lid,
        description = :d,
        imageUrl = :img,
        location = :loc
    `,
    ExpressionAttributeValues: {
      ":t": title,
      ":rt": rental_type,
      ":p": price,
      ":addr": address,
      ":a": area,
      ":am": Array.isArray(amenities) ? amenities : [],
      ":lid": landlordId,
      ":d": description,
      ":img": Array.isArray(imageUrl) ? imageUrl : [],
      ":loc": location,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await ddb.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Room updated successfully",
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

// ✅ DELETE
export const deleteRoom = async (event) => {
  const { roomId } = event.params || event.pathParameters || {};

  if (!roomId)
    return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };

  try {
    await ddb.send(
      new DeleteCommand({
        TableName: ROOMS_TABLE,
        Key: { id: roomId },
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
