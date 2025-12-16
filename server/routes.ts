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

  const systemPrompt = `You are an expert prompt engineer specializing in converting simple user descriptions into highly detailed, structured JSON prompts for image generation. 

Your task is to take a brief user input and expand it into a comprehensive JSON structure that captures:
- Subject details (description, age, expression, hair, clothing, face)
- Accessories (earrings, jewelry, devices)
- Photography settings (camera style, lighting, angle, shot type, texture)
- Background details (setting, wall color, elements, atmosphere, lighting)

Return ONLY valid JSON without any markdown formatting or explanations. The JSON should be detailed and vivid, suitable for creating high-quality AI-generated images in a 2000s aesthetic style.`;

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
