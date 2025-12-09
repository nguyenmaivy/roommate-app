// app/api/upload-images/route.js
import { uploadRoomImages } from "@/lib/s3";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    const urls = await uploadRoomImages(files);
    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}