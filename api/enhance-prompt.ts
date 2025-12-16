import type { VercelRequest, VercelResponse } from '@vercel/node';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function enhancePromptWithGroq(rawPrompt: string): Promise<any> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }

  const systemPrompt = `You are an expert prompt engineer specializing in converting user descriptions into richly detailed, structured JSON prompts for AI image generation with a 2000s aesthetic style.

CRITICAL RULES:
1. Expand and elaborate on details the user HAS mentioned - make them vivid and descriptive
2. DO NOT invent new subjects, people, ages, genders, or core elements not mentioned
3. For mentioned elements, add rich descriptive language (textures, colors, mood, atmosphere)
4. If photography style isn't specified, suggest appropriate 2000s-era camera aesthetics

Create a comprehensive JSON with these categories:
- subject: Elaborate on what the user described with vivid details
- clothing: Detailed description if clothing is mentioned
- accessories: Detailed if any accessories mentioned
- photography: Camera style, lighting, angle, shot type, texture (can suggest 2000s style defaults)
- background: Setting details, atmosphere, lighting, mood
- overall_mood: The vibe and aesthetic of the scene

Return ONLY valid JSON without markdown. Be creative and detailed about what IS mentioned, but never add unmentioned people, subjects, or core elements.`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Convert this prompt into detailed JSON: ${rawPrompt}` }
      ],
      temperature: 0.6,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error("No content received from Groq API");
  }

  let jsonContent = content.trim();
  if (jsonContent.startsWith("```json")) {
    jsonContent = jsonContent.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
  } else if (jsonContent.startsWith("```")) {
    jsonContent = jsonContent.replace(/```\n?/g, "");
  }

  try {
    return JSON.parse(jsonContent);
  } catch (e) {
    console.error("Failed to parse JSON:", jsonContent);
    throw new Error("Failed to parse enhanced prompt as JSON");
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rawPrompt } = req.body;

    if (!rawPrompt || typeof rawPrompt !== "string") {
      return res.status(400).json({ error: "Raw prompt is required and must be a string" });
    }

    const enhancedPrompt = await enhancePromptWithGroq(rawPrompt);

    res.json({
      id: Date.now(),
      enhancedPrompt,
    });
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to enhance prompt" 
    });
  }
}
