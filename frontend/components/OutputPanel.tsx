"use client";

import { downloadUrl, GenerationResult } from "@/lib/api";

const LABELS: Record<string, string> = {
  linkedin_post: "LinkedIn Post",
  twitter_thread: "X / Twitter Thread",
  executive_summary: "Executive Summary",
  advisory: "Advisory",
  presentation: "Presentation",
  infographic: "Infographic",
  video: "Video Package",
};

export default function OutputPanel({ results }: { results: GenerationResult[] }) {
  if (results.length === 0) return null;

  return (
    <section className="mt-16 animate-rise">
      <div className="mb-5 flex items-end justify-between border-b border-ink/10 pb-4">
        <div><p className="eyebrow">Output layer</p><h2 className="font-display mt-1 text-3xl font-semibold text-ink">Your deliverables</h2></div>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{results.length} generated</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
      {results.map((r, index) => (
        <div
          key={r.format}
          className="result-card"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-display text-xl font-semibold text-ink">
              {LABELS[r.format] || r.format}
            </h3>
            {r.file_url && (
              <a
                href={downloadUrl(r.file_url)}
                className="download-link"
              >
                Download <span>{"->"}</span>
              </a>
            )}
          </div>
          <div className="mb-4 h-px bg-ink/10" />
          {r.error && <p className="error-note">{r.error}</p>}
          {r.content && (
            <pre className="result-copy">
              {r.content}
            </pre>
          )}
        </div>
      ))}
      </div>
    </section>
  );
}
