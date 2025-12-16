import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.json([]);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to fetch prompts" 
    });
  }
}
