// initDynamo.js
import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

// ===== IMPORT MOCK DATA (chỉ những cái còn tồn tại) =====
import { AMENITIES, USERS, ROOMS ,FAVOURITES } from "../frontend/mockData.js";

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

  //// Thêm tài khoản Admin
  // await ddb.send(
  //   new PutCommand({
  //     TableName: "Users",
  //     Item: {
  //       email: "admin@roommate.com",
  //       name: "Admin",
  //       password: await bcrypt.hash("admin123", 10),
  //       role: "admin",
  //     },
  //   })
  // );
  await ddb.send(
    new PutCommand({
      TableName: "Users",
      Item: {
        email: "phuhuynh.010104@gmail.com",        // ✅ Bắt buộc phải có key email
        name: "Admin",
        password: await bcrypt.hash("123456", 10),
        local: [10.8231, 106.6297],
        role: "admin",
      },
    })
  );

  console.log("✅ Inserted INITIAL_USER");

  // Thêm tất cả landlord từ USER (mật khẩu trong mock là "1234")
  for (const user of USERS) {
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

  console.log(`Đã thêm 1 admin + ${USERS.length} landlord vào bảng Users`);
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

// ===== TẠO BẢNG FAVOURITES (nếu cần) =====
async function createFAVOURITESTable() {
  await client.send(
    new CreateTableCommand({
      TableName: "FAVOURITES",
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
  console.log("Tạo bảng FAVOURITES");

  // Nếu có dữ liệu thì thêm vào
  if (FAVOURITES.length > 0) {
    for (const fav of FAVOURITES) {
      await ddb.send(
        new PutCommand({
          TableName: "FAVOURITES",
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
// ===== CREATE TABLE MESSAGES =====
async function createMessagesTable() {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: "Messages",
        KeySchema: [
          { AttributeName: "roomId", KeyType: "HASH" },
          { AttributeName: "createdAt", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "roomId", AttributeType: "S" },
          { AttributeName: "createdAt", AttributeType: "N" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    );

    console.log("✅ Created table: Messages");
  } catch (err) {
    console.error("❌ Error creating Messages table:", err);
  }
}

// ===== CHẠY TOÀN BỘ =====
async function initDB() {
  console.log("Khởi tạo DynamoDB Local với mockData.js mới...");

  await deleteTableIfExists("Users");
  await deleteTableIfExists("Rooms");
  await deleteTableIfExists("Amenities");
  await deleteTableIfExists("FAVOURITES");
  await deleteTableIfExists("Messages");

  await createUsersTable();
  await createRoomsTable();
  await createAmenitiesTable();
  await createFAVOURITESTable();
  await createMessagesTable();

  console.log("HOÀN TẤT! DynamoDB Local đã sẵn sàng!");

}

initDB().catch((err) => {
  console.error("Lỗi:", err);
  process.exit(1);
});
