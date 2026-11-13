import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_VISION_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const SYSTEM_PROMPT = `You are an expert medical AI assistant. A user has uploaded a handwritten or printed doctor's prescription from India.

Your task:
1. Read and extract ALL medicines/drugs mentioned in the prescription
2. For each medicine, provide detailed information

Respond ONLY with valid JSON in this exact format:
{
  "doctor": "Dr. Name if visible, else null",
  "patient": "Patient name if visible, else null",
  "date": "Date if visible, else null",
  "diagnosis": "Diagnosis/condition if mentioned, else null",
  "medicines": [
    {
      "name": "Medicine name (brand + generic if visible)",
      "generic": "Generic/chemical name",
      "dosage": "Dosage as written (e.g. 500mg, 10mg)",
      "frequency": "How often (e.g. twice daily, OD, BD, TDS)",
      "duration": "Duration if mentioned (e.g. 5 days, 1 month)",
      "instructions": "Special instructions (e.g. after food, with water, avoid sunlight)",
      "uses": "What this medicine is used to treat (2-3 sentences)",
      "howItWorks": "Simple explanation of mechanism (1-2 sentences)",
      "sideEffects": ["Common side effect 1", "Common side effect 2", "Common side effect 3"],
      "warnings": "Important warnings or interactions",
      "category": "Drug category (e.g. Antibiotic, Antacid, Painkiller, Vitamin, etc.)"
    }
  ],
  "generalInstructions": "Any general instructions from the prescription",
  "followUp": "Follow-up date if mentioned, else null"
}

If you cannot read the image or it is not a prescription, return:
{ "error": "Cannot read prescription. Please upload a clearer image." }

Be thorough and accurate. Use Indian brand names where applicable.`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "API not configured" }, { status: 500 });
  }

  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const res = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              {
                inline_data: {
                  mime_type: mimeType || "image/jpeg",
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini vision error:", err);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse prescription" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Prescription route error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
