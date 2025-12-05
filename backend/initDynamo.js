// initDynamo.js
import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

// ===== IMPORT MOCK DATA (chỉ những cái còn tồn tại) =====
import { AMENITIES, USER, ROOMS, FAVORITE } from "../frontend/mockData.js";

// ===== CẤU HÌNH DYNAMODB LOCAL =====
const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
});

const ddb = DynamoDBDocumentClient.from(client);

// ===== XÓA BẢNG NẾU TỒN TẠI =====
async function deleteTableIfExists(tableName) {
  try {
    await client.send(new DeleteTableCommand({ TableName: tableName }));
    console.log(`Đã xóa bảng: ${tableName}`);
  } catch (err) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`Bảng ${tableName} chưa tồn tại → bỏ qua`);
    } else throw err;
  }
}

// ===== TẠO BẢNG USERS (bao gồm cả admin và landlord) =====
async function createUsersTable() {
  await client.send(
    new CreateTableCommand({
      TableName: "Users",
      KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "email", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );
  console.log("Tạo bảng Users");

  // Thêm tài khoản Admin
  await ddb.send(
    new PutCommand({
      TableName: "Users",
      Item: {
        email: "admin@roommate.com",
        name: "Admin",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
    })
  );

  // Thêm tất cả landlord từ USER (mật khẩu trong mock là "1234")
  for (const user of USER) {
    await ddb.send(
      new PutCommand({
        TableName: "Users",
        Item: {
          email: user.email,
          name: user.contact_name,
          phone: user.contact_phone.toString(),
          password: await bcrypt.hash(user.password || "1234", 10),
          role: user.role || "landlord",
          landlordId: user.id, // giữ lại id cũ để liên kết với phòng
        },
      })
    );
  }

  console.log(`Đã thêm 1 admin + ${USER.length} landlord vào bảng Users`);
}

// ===== TẠO BẢNG ROOMS =====
async function createRoomsTable() {
  await client.send(
    new CreateTableCommand({
      TableName: "Rooms",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );
  console.log("Tạo bảng Rooms");

  for (const room of ROOMS) {
    // Sửa lỗi amenities bị viết sai (kit, airCon, Paking → "kit", "airCon", "parking")
    const fixedAmenities = (room.amenities || []).map(a => {
      if (typeof a === "string") return a;
      if (a === "Paking") return "parking";
      // Các trường hợp sai khác → chuẩn hóa
      const map = {
        kit: "kit",
        airCon: "airCon",
        wm: "wm",
        ref: "ref",
        flxh: "flxh",
        elv: "elv",
        parking: "parking",
        nso: "nso",
        frn: "frn",
        mez: "mez",
        sec24: "sec24",
      };
      return map[a] || a;
    });

    const cleanedRoom = {
      ...room,
      price: Number(room.price),
      area: Number(room.area) || null,
      amenities: fixedAmenities,
      imageUrl: Array.isArray(room.imageUrl) ? room.imageUrl : [],
      location: room.location || null,
      date: room.date || new Date().toISOString(),
    };

    await ddb.send(
      new PutCommand({
        TableName: "Rooms",
        Item: cleanedRoom,
      })
    );
  }

  console.log(`Đã thêm ${ROOMS.length} phòng vào bảng Rooms`);
}

// ===== TẠO BẢNG AMENITIES =====
async function createAmenitiesTable() {
  await client.send(
    new CreateTableCommand({
      TableName: "Amenities",
      KeySchema: [{ AttributeName: "key", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "key", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );
  console.log("Tạo bảng Amenities");

  for (const amenity of AMENITIES) {
    await ddb.send(
      new PutCommand({
        TableName: "Amenities",
        Item: amenity,
      })
    );
  }
  console.log(`Đã thêm ${AMENITIES.length} tiện ích`);
}

// ===== TẠO BẢNG FAVORITE (nếu cần) =====
async function createFavoriteTable() {
  await client.send(
    new CreateTableCommand({
      TableName: "Favorite",
      KeySchema: [
        { AttributeName: "userEmail", KeyType: "HASH" },
        { AttributeName: "roomId", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "userEmail", AttributeType: "S" },
        { AttributeName: "roomId", AttributeType: "S" },
      ],
      BillingMode: "PAY_PER_REQUEST",
    })
  );
  console.log("Tạo bảng Favorite");

  // Nếu có dữ liệu thì thêm vào
  if (FAVORITE.length > 0) {
    for (const fav of FAVORITE) {
      await ddb.send(
        new PutCommand({
          TableName: "Favorite",
          Item: {
            userEmail: fav.userEmail,
            roomId: fav.roomId,
            date: fav.date || new Date().toISOString(),
          },
        })
      );
    }
  }
}

// ===== CHẠY TOÀN BỘ =====
async function initDB() {
  console.log("Khởi tạo DynamoDB Local với mockData.js mới...");

  await deleteTableIfExists("Users");
  await deleteTableIfExists("Rooms");
  await deleteTableIfExists("Amenities");
  await deleteTableIfExists("Favorite");

  await createUsersTable();
  await createRoomsTable();
  await createAmenitiesTable();
  await createFavoriteTable();

  console.log("HOÀN TẤT! DynamoDB Local đã sẵn sàng!");
  console.log("Admin: admin@roommate.com / admin123");
  console.log("Landlord: dùng email trong mockData.js / mật khẩu: 1234");
}

initDB().catch((err) => {
  console.error("Lỗi:", err);
  process.exit(1);
});