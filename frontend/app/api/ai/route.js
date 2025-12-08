import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const completion = await openrouter.chat.send({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content: "Bạn là AI giúp trích xuất thông tin tìm phòng từ câu người dùng."
        },
        {
          role: "user",
          content: `
Trích xuất thông tin tìm phòng từ câu sau:
"${message}"

CHỈ TRẢ VỀ JSON:
{
  "budget": number | null,
  "location": string | null,
  "type": string | null,
  "area": number | null,
  "amenities": string[]
}

Ví dụ amenities: ["airCon", "kit", "Paking"]
`
        }
      ],
    });

    // ✅ PHẢI DÙNG let
    let text = completion.choices[0].message.content;

    // ✅ XÓA ```json nếu có
    text = text.replace(/```json|```/g, "").trim();

    return Response.json(JSON.parse(text));
  } catch (err) {
    console.error("AI API ERROR:", err);

    return Response.json({ error: "Lỗi khi gọi AI" }, { status: 500 });
  }
}
