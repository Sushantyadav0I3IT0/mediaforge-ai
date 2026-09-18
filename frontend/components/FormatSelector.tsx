"use client";

import { OutputFormat } from "@/lib/api";

const FORMATS: { id: OutputFormat; label: string; desc: string; mark: string }[] = [
  { id: "linkedin_post", label: "LinkedIn Post", desc: "Professional post", mark: "LI" },
  { id: "twitter_thread", label: "X / Twitter", desc: "Numbered thread", mark: "X" },
  { id: "executive_summary", label: "Executive Brief", desc: "Leadership summary", mark: "EB" },
  { id: "advisory", label: "Advisory", desc: "Structured guidance", mark: "AD" },
  { id: "presentation", label: "Presentation", desc: "PPTX slide deck", mark: "P" },
  { id: "infographic", label: "Infographic", desc: "Visual content brief", mark: "IG" },
  { id: "video", label: "Video Package", desc: "Script and storyboard", mark: "V" },
];

export default function FormatSelector({
  selected,
  onChange,
}: {
  selected: OutputFormat[];
  onChange: (f: OutputFormat[]) => void;
}) {
  function toggle(id: OutputFormat) {
    if (selected.includes(id)) {
      onChange(selected.filter((f) => f !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {FORMATS.map((f) => {
        const active = selected.includes(f.id);
        return (
          <button
            type="button"
            key={f.id}
            onClick={() => toggle(f.id)}
            aria-pressed={active}
            className={`group format-card text-left ${
              active
                ? "format-card-active format-card-selected"
                : "format-card-idle"
            }`}
          >
            <span className="format-mark">{f.mark}</span>
            <span className="min-w-0"><span className="block text-sm font-bold text-ink">{f.label}</span><span className="mt-1 block text-xs text-muted">{f.desc}</span></span>
            <span className="ml-auto text-lg text-brand opacity-0 transition group-hover:opacity-100">+</span>
          </button>
        );
      })}
    </div>
  );
}
