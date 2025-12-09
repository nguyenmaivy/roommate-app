// roomCrud.js
import { v4 as uuidv4 } from "uuid";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { uploadRoomImages } from "../lib/s3.js"; // ← Import hàm upload S3

let ddb;
export const __setDocumentClient = (client) => {
  ddb = client;
};

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

// CREATE ROOM + UPLOAD ẢNH
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
    images,        // ← Nhận files ảnh từ frontend
    location,
  } = body;

  if (!title || !price || !address || !area || !location) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" }),
    };
  }

  let imageUrls = [];

  // Nếu có ảnh → upload lên S3
  if (images && images.length > 0) {
    try {
      imageUrls = await uploadRoomImages(images); // ← Hàm từ lib/s3.js
    } catch (err) {
      console.error("Upload images failed:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to upload images" }),
      };
    }
  }

  const id = uuidv4();

  const item = {
    id,
    title,
    rental_type: rental_type || "Cho thuê phòng trọ",
    date: formatDate(),
    address,
    price: Number(price),
    area: Number(area),
    amenities: Array.isArray(amenities) ? amenities : [],
    landlordId: landlordId || "unknown",
    description: description || "",
    imageUrl: imageUrls, // ← Lưu mảng URL ảnh công khai
    location,
    createdAt: new Date().toISOString(),
  };

  try {
    await ddb.send(new PutCommand({ TableName: ROOMS_TABLE, Item: item }));
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Room created", room: item }),
    };
  } catch (err) {
    console.error("DynamoDB Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// UPDATE ROOM + CẬP NHẬT ẢNH
export const updateRoom = async (event) => {
  const { roomId } = event.pathParameters || {};
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
    images,        // ← Ảnh mới (nếu có)
    location,
  } = body;

  if (!roomId) {
    return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };
  }

  let imageUrls = [];

  // Nếu có ảnh mới → upload
  if (images && images.length > 0) {
    try {
      imageUrls = await uploadRoomImages(images);
    } catch (err) {
      console.error("Upload images failed:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to upload images" }),
      };
    }
  }

  const updateExpression = [];
  const ExpressionAttributeValues = {};

  if (title !== undefined) {
    updateExpression.push("title = :t");
    ExpressionAttributeValues[":t"] = title;
  }
  if (rental_type !== undefined) {
    updateExpression.push("rental_type = :rt");
    ExpressionAttributeValues[":rt"] = rental_type;
  }
  if (price !== undefined) {
    updateExpression.push("price = :p");
    ExpressionAttributeValues[":p"] = Number(price);
  }
  if (address !== undefined) {
    updateExpression.push("address = :addr");
    ExpressionAttributeValues[":addr"] = address;
  }
  if (area !== undefined) {
    updateExpression.push("area = :a");
    ExpressionAttributeValues[":a"] = Number(area);
  }
  if (amenities !== undefined) {
    updateExpression.push("amenities = :am");
    ExpressionAttributeValues[":am"] = Array.isArray(amenities) ? amenities : [];
  }
  if (description !== undefined) {
    updateExpression.push("description = :d");
    ExpressionAttributeValues[":d"] = description;
  }
  if (location !== undefined) {
    updateExpression.push("location = :loc");
    ExpressionAttributeValues[":loc"] = location;
  }
  if (imageUrls.length > 0) {
    updateExpression.push("imageUrl = :img");
    ExpressionAttributeValues[":img"] = imageUrls;
  }

  if (updateExpression.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "No fields to update" }) };
  }

  const params = {
    TableName: ROOMS_TABLE,
    Key: { id: roomId },
    UpdateExpression: "SET " + updateExpression.join(", "),
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await ddb.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Room updated",
        room: result.Attributes,
      }),
    };
  } catch (err) {
    console.error("Update error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// Các hàm còn lại giữ nguyên
export const getRooms = async () => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: ROOMS_TABLE }));
    return { statusCode: 200, body: JSON.stringify({ rooms: result.Items || [] }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

export const getRoom = async (event) => {
  const { roomId } = event.pathParameters || {};
  if (!roomId) return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };

  try {
    const result = await ddb.send(new GetCommand({ TableName: ROOMS_TABLE, Key: { id: roomId } }));
    if (!result.Item) return { statusCode: 404, body: JSON.stringify({ error: "Room not found" }) };
    return { statusCode: 200, body: JSON.stringify({ room: result.Item }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

export const deleteRoom = async (event) => {
  const { roomId } = event.pathParameters || {};
  if (!roomId) return { statusCode: 400, body: JSON.stringify({ error: "roomId required" }) };

  try {
    await ddb.send(new DeleteCommand({ TableName: ROOMS_TABLE, Key: { id: roomId } }));
    return { statusCode: 200, body: JSON.stringify({ message: "Room deleted" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};