export type OutputFormat =
  | "linkedin_post"
  | "twitter_thread"
  | "executive_summary"
  | "advisory"
  | "presentation"
  | "infographic"
  | "video";

export interface GenerationResult {
  format: OutputFormat;
  content?: string;
  file_url?: string;
  error?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function generateContent(payload: {
  content: string;
  formats: OutputFormat[];
  audience: string;
  tone: string;
  language: string;
  detail_level: string;
  objective: string;
}): Promise<GenerationResult[]> {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = "Request failed";
    try {
      const error = await res.json();
      detail = error.detail || detail;
    } catch {
      // Keep the status fallback when the server does not return JSON.
    }
    throw new Error(`${detail} (${res.status})`);
  }

  const data = await res.json();
  return data.results;
}

export function downloadUrl(fileUrl: string) {
  return `${API_BASE}${fileUrl}`;
}
