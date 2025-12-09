// lib/s3.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1", 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "aws-sam-cli-managed-default-samclisourcebucket-2gedu8givvew";
const FOLDER = "roommate-app-images";

export async function uploadRoomImages(files) {
  const uploadedUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `${Date.now()}-${i}-${file.name.replace(/\s+/g, "-")}`;
    const key = `${FOLDER}/${fileName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",   // ← QUAN TRỌNG: cho phép public đọc ngay khi upload
      })
    );

    // Trả về URL S3 trực tiếp (load được ngay)
    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    // hoặc đẹp hơn một chút:
    // const url = `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${key}`;

    uploadedUrls.push(url);
  }

  return uploadedUrls;
}