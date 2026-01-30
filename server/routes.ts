import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPromptSchema } from "@shared/schema";
import { z } from "zod";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function enhancePromptWithGroq(rawPrompt: string): Promise<any> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }

  const systemPrompt = `You are an expert prompt engineer specializing in converting simple user descriptions into richly detailed, hyper-realistic photography prompts.

Take the user's simple input and expand it using the following template. Do not change the technical headers. Replace the bracketed [ ] sections with details intelligently inferred from the user's request. Be creative and detailed when filling in the blanks.

IMPORTANT RULES:
1. Keep ALL section headers exactly as shown (e.g., "[Header: Technical Specs]")
2. Replace ALL bracketed placeholders with specific, contextually appropriate details
3. If the user's input lacks certain details, infer reasonable and fitting choices
4. Make the output feel like a professional photography brief
5. Return ONLY the filled template, no additional commentary

THE TEMPLATE:

[Header: Technical Specs]
Raw high-fidelity photograph, simulated {CAMERA_TYPE} sensor, 8K UHD, authentic digital noise, slight film grain.
Lens: {LENS_TYPE}, Aperture: {F-STOP}, Shutter: 1/125s.
Focus: Sharp focus on the eyes/face with realistic depth-of-field falloff.

[Subject: Bio-Fidelity & Identity]
Subject: {DETAILED_SUBJECT_DESCRIPTION}
Skin Physics: Hyper-realistic skin texture, visible micropores on nose and cheeks, satin-finish hydration, natural skin translucency (subsurface scattering), slight natural imperfections (moles, freckles, capillaries).
Hair Physics: High-definition strand separation, {HAIR_COLOR_AND_STYLE}, creating natural shadows on the face, visible flyaways and baby hairs (vellus hair) along the hairline.
Eyes: Highly detailed irises with radial patterns, sharp catchlights from the light source, moisture on the lower waterline.

[Apparel & Material Physics]
Wardrobe: {CLOTHING_DETAILS}
Textiles: Visible fabric weave, realistic tension lines and compression folds where fabric meets skin, tactile texture (e.g., knit fuzz, denim grain, silk sheen).

[Pose & Expression]
Pose: {POSE_DESCRIPTION}, anatomical accuracy in hands and joints, natural weight distribution.
Expression: {MICRO_EXPRESSION}, eyes looking {EYE_DIRECTION}.

[Environment & Lighting Architecture]
Setting: {LOCATION_OR_BACKGROUND}
Lighting: {LIGHTING_TYPE}, accurate shadow casting, caustic reflections on shiny surfaces.
Atmosphere: Photorealistic, "indistinguishable from reality," candid, {MOOD_DESCRIPTION}.`;

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
        { role: "user", content: `Expand this into a detailed photography prompt using the template: "${rawPrompt}"` }
      ],
      temperature: 0.7,
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

  // Return the enhanced prompt as a structured object
  const enhancedText = content.trim();

  // Parse the template sections into a structured object
  const sections: Record<string, string> = {};
  const sectionRegex = /\[([^\]]+)\]\n([\s\S]*?)(?=\n\[|$)/g;
  let match;

  while ((match = sectionRegex.exec(enhancedText)) !== null) {
    const sectionName = match[1].trim();
    const sectionContent = match[2].trim();
    sections[sectionName] = sectionContent;
  }

  return {
    fullPrompt: enhancedText,
    sections: sections,
    technicalSpecs: sections["Header: Technical Specs"] || "",
    subject: sections["Subject: Bio-Fidelity & Identity"] || "",
    apparel: sections["Apparel & Material Physics"] || "",
    pose: sections["Pose & Expression"] || "",
    environment: sections["Environment & Lighting Architecture"] || ""
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/enhance-prompt", async (req, res) => {
    try {
      const { rawPrompt } = req.body;

      if (!rawPrompt || typeof rawPrompt !== "string") {
        return res.status(400).json({ error: "Raw prompt is required and must be a string" });
      }

      const enhancedPrompt = await enhancePromptWithGroq(rawPrompt);

      const promptData = insertPromptSchema.parse({
        rawPrompt,
        enhancedPrompt,
      });

      const savedPrompt = await storage.createPrompt(promptData);

      res.json({
        id: savedPrompt.id,
        enhancedPrompt: savedPrompt.enhancedPrompt,
      });
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to enhance prompt"
      });
    }
  });

  app.get("/api/prompts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const prompts = await storage.getPrompts(limit);
      res.json(prompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to fetch prompts"
      });
    }
  });

  return httpServer;
}
