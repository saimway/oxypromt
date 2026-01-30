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

  const systemPrompt = `You are an expert prompt engineer specializing in converting user descriptions into richly detailed,

  Take the user's simple input and expand it using the following template. Do not change the technical headers. Replace the bracketed [ ] sections with details inferred from the user's request
  
[Header: Technical Specs]
Raw high-fidelity photograph, simulated {CAMERA_TYPE, e.g., iPhone 17 Pro / Sony A7R IV} sensor, 8K UHD, authentic digital noise, slight film grain.
Lens: {LENS_TYPE, e.g., 24mm wide-angle or 85mm portrait}, Aperture: {F-STOP, e.g., f/1.8}, Shutter: 1/125s.
Focus: Sharp focus on the eyes/face with realistic depth-of-field falloff.

[Subject: Bio-Fidelity & Identity]
Subject: [INSERT DETAILED DESCRIPTION OF SUBJECT HERE]
Skin Physics: Hyper-realistic skin texture, visible micropores on nose and cheeks, satin-finish hydration, natural skin translucency (subsurface scattering), slight natural imperfections (moles, freckles, capillaries).
Hair Physics: High-definition strand separation, [INSERT HAIR COLOR/STYLE], creating natural shadows on the face, visible flyaways and baby hairs (vellus hair) along the hairline.
Eyes: Highly detailed irises with radial patterns, sharp catchlights from the light source, moisture on the lower waterline.

[Apparel & Material Physics]
Wardrobe: [INSERT CLOTHING DETAILS]
Textiles: Visible fabric weave, realistic tension lines and compression folds where fabric meets skin, tactile texture (e.g., knit fuzz, denim grain, silk sheen).

[Pose & Expression]
Pose: [INSERT POSE], anatomical accuracy in hands and joints, natural weight distribution.
Expression: [INSERT MICRO-EXPRESSION, e.g., subtle smirk, relaxed gaze], eyes looking [DIRECTION].

[Environment & Lighting Architecture]
Setting: [INSERT LOCATION/BACKGROUND]
Lighting: [INSERT LIGHTING TYPE, e.g., Soft diffused window light / Golden hour sun], accurate shadow casting, caustic reflections on shiny surfaces.
Atmosphere: Photorealistic, "indistinguishable from reality," candid, [INSERT MOOD].
.`;

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
