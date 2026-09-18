"use client";

import { useState } from "react";
import FormatSelector from "@/components/FormatSelector";
import OutputPanel from "@/components/OutputPanel";
import { generateContent, GenerationResult, OutputFormat } from "@/lib/api";

export default function Home() {
  const [content, setContent] = useState("");
  const [formats, setFormats] = useState<OutputFormat[]>(["linkedin_post"]);
  const [audience, setAudience] = useState("general public");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("English");
  const [detail, setDetail] = useState("medium");
  const [objective, setObjective] = useState("inform");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [error, setError] = useState("");

  const sampleContent =
    "The National Cyber Centre has identified a rise in credential phishing campaigns targeting public-sector organisations. Attackers are using convincing service alerts to direct employees to lookalike sign-in pages. Organisations should enable phishing-resistant MFA, review suspicious login alerts, and remind staff to verify links before entering credentials.";

  async function handleGenerate() {
    if (content.trim().length < 20) {
      setError("Add at least a short paragraph of source content.");
      return;
    }
    if (formats.length === 0) {
      setError("Select at least one output format.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);
    try {
      const res = await generateContent({
        content,
        formats,
        audience,
        tone,
        language,
        detail_level: detail,
        objective,
      });
      setResults(res);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-ink/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="brand-mark">M</div>
          <div>
            <div className="font-display text-xl font-semibold tracking-tight text-ink">MediaForge</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted">Content intelligence</div>
          </div>
        </div>
        <div className="hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted sm:flex">
          <span className="status-dot" />
          OpenRouter connected
        </div>
      </nav>

      <div className="mx-auto max-w-7xl pb-16 pt-10 lg:pt-16">
        <header className="mb-10 max-w-3xl animate-rise">
          <p className="eyebrow">Transformation workspace / 01</p>
          <h1 className="font-display mt-3 text-5xl leading-[0.96] tracking-[-0.04em] text-ink sm:text-7xl">
            One source.<br /><span className="text-brand">Every signal.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Shape complex information into clear, audience-ready communication in a single pass.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <section className="paper-panel animate-rise [animation-delay:120ms]">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-6 py-5 sm:px-8">
              <div>
                <p className="eyebrow">Input layer</p>
                <h2 className="font-display mt-1 text-2xl font-semibold text-ink">Start with the source</h2>
              </div>
              <span className="step-badge">01</span>
            </div>
            <div className="space-y-7 p-6 sm:p-8">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="label-text" htmlFor="source-content">Source content</label>
                  <button type="button" className="text-xs font-bold text-brand underline-offset-4 hover:underline" onClick={() => setContent(sampleContent)}>
                    Use sample
                  </button>
                </div>
                <textarea
                  id="source-content"
                  className="source-input"
                  placeholder="Paste an article, report, advisory, or prompt..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="mt-2 flex justify-between text-xs text-muted">
                  <span>Grounded generation enabled</span>
                  <span>{content.length.toLocaleString()} characters</span>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="label-text">Output formats</p>
                    <p className="mt-1 text-sm text-muted">Select one or several deliverables.</p>
                  </div>
                  <span className="text-xs font-bold text-brand">{formats.length} selected</span>
                </div>
                <FormatSelector selected={formats} onChange={setFormats} />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <Select label="Audience" value={audience} onChange={setAudience} options={["general public", "executives", "technical team", "policy makers"]} />
                <Select label="Tone" value={tone} onChange={setTone} options={["professional", "urgent", "casual", "authoritative"]} />
                <Select label="Language" value={language} onChange={setLanguage} options={["English", "Hindi", "Hinglish"]} />
                <Select label="Detail" value={detail} onChange={setDetail} options={["brief", "medium", "detailed"]} />
                <Select label="Objective" value={objective} onChange={setObjective} options={["inform", "persuade", "instruct", "summarize"]} />
              </div>

              {error && <p className="error-note">{error}</p>}

              <div className="flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center">
                <p className="max-w-xs text-xs leading-5 text-muted">Your outputs will be grounded in the source and tuned to the controls above.</p>
                <button onClick={handleGenerate} disabled={loading} className="generate-button">
                  <span>{loading ? "Forging outputs" : "Generate outputs"}</span>
                  <span className="button-arrow">{loading ? "..." : "->"}</span>
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-4 animate-rise [animation-delay:240ms]">
            <div className="side-panel dark-panel">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-coral">The forge</p>
                <span className="text-xs text-white/50">LIVE</span>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-5">
                <div><div className="font-display text-4xl text-white">07</div><div className="mt-1 text-xs text-white/50">output formats</div></div>
                <div><div className="font-display text-4xl text-coral">01</div><div className="mt-1 text-xs text-white/50">source of truth</div></div>
              </div>
              <div className="mt-10 h-px bg-white/15" />
              <p className="mt-5 text-sm leading-6 text-white/70">From briefing to broadcast, transform one idea into the formats your audience already uses.</p>
            </div>
            <div className="side-panel accent-panel">
              <p className="eyebrow">Workflow</p>
              <div className="mt-5 space-y-4">
                <WorkflowItem number="01" title="Ground" detail="Source-aware prompts" />
                <WorkflowItem number="02" title="Shape" detail="Audience and tone controls" />
                <WorkflowItem number="03" title="Release" detail="Ready-to-use deliverables" />
              </div>
            </div>
          </aside>
        </div>

        <OutputPanel results={results} />
      </div>
    </main>
  );
}

function WorkflowItem({ number, title, detail }: { number: string; title: string; detail: string }) {
  return <div className="flex items-center gap-3"><span className="workflow-number">{number}</span><div><div className="text-sm font-bold text-ink">{title}</div><div className="text-xs text-muted">{detail}</div></div></div>;
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="label-text mb-1 block text-[10px]" htmlFor={label}>{label}</label>
      <select
        id={label}
        className="select-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
