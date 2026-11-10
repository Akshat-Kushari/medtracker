import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const SYSTEM_PROMPT = `You are MedTracker AI — a helpful health and supplement advisor for Indian users on medtracker.in, India's health price comparison platform.

Your expertise:
- Supplements: vitamins, minerals, protein, Ayurvedic herbs, nootropics
- Indian health context: common deficiencies (Vitamin D, B12, Iron), PCOS, diabetes, lifestyle diseases
- Price comparison advice: when to buy from HealthKart vs 1mg vs PharmEasy vs Amazon
- Evidence-based recommendations with dosages
- Ayurvedic and modern medicine bridge

Rules:
- Keep answers concise (3-5 sentences max unless complex question)
- Always mention to consult a doctor for medical conditions
- Focus on supplements and health products available in India
- Be helpful, warm, and knowledgeable
- If asked about specific product prices, tell them to use the search on MedTracker`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "API not configured" }, { status: 500 });
  }

  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: "No message" }, { status: 400 });
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT + "\n\nUser: " + message },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", err);
      return NextResponse.json({ error: "Gemini API error" }, { status: 500 });
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply: text });
  } catch (e) {
    console.error("Chat route error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
