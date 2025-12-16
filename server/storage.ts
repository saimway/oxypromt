import { type Prompt, type InsertPrompt } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  getPrompts(limit?: number): Promise<Prompt[]>;
}

export class MemStorage implements IStorage {
  private prompts: Map<string, Prompt>;

  constructor() {
    this.prompts = new Map();
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = randomUUID();
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      createdAt: new Date(),
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async getPrompts(limit = 10): Promise<Prompt[]> {
    return Array.from(this.prompts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
