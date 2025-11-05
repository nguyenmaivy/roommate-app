import { v4 as uuidv4 } from "uuid";
import { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

let ddb;
export const __setDocumentClient = (client) => { ddb = client; };

const ROOMS_TABLE = "Rooms";

// CREATE
export const createRoom = async (event) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const { title, price, district, city, area, amenities } = body;
  if (!title || !price || !district || !city || !area) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
  }

  const roomId = uuidv4();
  const item = { roomId, title, price, district, city, area, amenities: amenities || [] };

  try {
    await ddb.send(new PutCommand({ TableName: ROOMS_TABLE, Item: item }));
    return { statusCode: 201, body: JSON.stringify({ message: "Room created", room: item }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
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
  if (!roomId) return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };
  try {
    const result = await ddb.send(new GetCommand({ TableName: ROOMS_TABLE, Key: { roomId } }));
    return { statusCode: 200, body: JSON.stringify({ room: result.Item }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// UPDATE
export const updateRoom = async (event) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const { roomId, title, price, district, city, area, amenities } = body;
  if (!roomId) return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };

  const params = {
    TableName: ROOMS_TABLE,
    Key: { roomId },
    UpdateExpression: "set title=:t, price=:p, district=:d, city=:c, area=:a, amenities=:am",
    ExpressionAttributeValues: {
      ":t": title,
      ":p": price,
      ":d": district,
      ":c": city,
      ":a": area,
      ":am": amenities || [],
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await ddb.send(new UpdateCommand(params));
    return { statusCode: 200, body: JSON.stringify({ message: "Room updated", room: result.Attributes }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// DELETE
export const deleteRoom = async (event) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const { roomId } = body;
  if (!roomId) return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };

  try {
    await ddb.send(new DeleteCommand({ TableName: ROOMS_TABLE, Key: { roomId } }));
    return { statusCode: 200, body: JSON.stringify({ message: "Room deleted" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
