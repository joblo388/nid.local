"use client";

import { useState, useRef, useCallback } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  minLength?: number;
};

// ─── Toolbar helpers ────────────────────────────────────────────────────────

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder: string,
  onChange: (v: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || placeholder;
  const newValue =
    textarea.value.slice(0, start) + before + selected + after + textarea.value.slice(end);
  onChange(newValue);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
  });
}

function prependLine(
  textarea: HTMLTextAreaElement,
  prefix: string,
  onChange: (v: string) => void
) {
  const start = textarea.selectionStart;
  const lineStart = textarea.value.lastIndexOf("\n", start - 1) + 1;
  const newValue =
    textarea.value.slice(0, lineStart) + prefix + textarea.value.slice(lineStart);
  onChange(newValue);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = start + prefix.length;
  });
}

// ─── Tool definitions ───────────────────────────────────────────────────────

type Tool = {
  id: string;
  label: string;
  title: string;
  icon: React.ReactNode;
  group: number;
  action: (textarea: HTMLTextAreaElement, onChange: (v: string) => void) => void;
};

const TOOLS: Tool[] = [
  {
    id: "bold",
    label: "Gras",
    title: "Gras (Ctrl+B)",
    group: 1,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h8a5 5 0 0 1 3.5 8.5A5.5 5.5 0 0 1 15 21H6V4zm3 3v4h5a2 2 0 1 0 0-4H9zm0 7v4h6a2.5 2.5 0 0 0 0-5H9z" />
      </svg>
    ),
    action: (t, cb) => wrapSelection(t, "**", "**", "texte en gras", cb),
  },
  {
    id: "italic",
    label: "Italique",
    title: "Italique (Ctrl+I)",
    group: 1,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4h8v2h-2.87l-4.26 12H14v2H6v-2h2.87l4.26-12H10V4z" />
      </svg>
    ),
    action: (t, cb) => wrapSelection(t, "*", "*", "texte en italique", cb),
  },
  {
    id: "heading",
    label: "Titre",
    title: "Titre (##)",
    group: 2,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h2v7h8V4h2v16h-2v-7H6v7H4V4zm16.5 2.5h-3V4H21v3h-2.5v1H21v2h-2.5v6h3V18H15v-2h3v-6h-3V8h3V6.5z" />
      </svg>
    ),
    action: (t, cb) => prependLine(t, "## ", cb),
  },
  {
    id: "list",
    label: "Liste",
    title: "Liste a puces",
    group: 2,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="9" y1="6" x2="20" y2="6" />
        <line x1="9" y1="12" x2="20" y2="12" />
        <line x1="9" y1="18" x2="20" y2="18" />
        <circle cx="4.5" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="18" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    action: (t, cb) => prependLine(t, "- ", cb),
  },
  {
    id: "link",
    label: "Lien",
    title: "Lien [texte](url)",
    group: 3,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    action: (t, cb) => wrapSelection(t, "[", "](https://)", "texte du lien", cb),
  },
  {
    id: "code",
    label: "Code",
    title: "Code inline (`code`)",
    group: 3,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    action: (t, cb) => wrapSelection(t, "`", "`", "code", cb),
  },
  {
    id: "quote",
    label: "Citation",
    title: "Citation (>)",
    group: 3,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.2 11 15c0 1.865-1.567 3.377-3.5 3.377-1.174 0-2.292-.534-2.917-1.056zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.2 21 15c0 1.865-1.567 3.377-3.5 3.377-1.174 0-2.292-.534-2.917-1.056z" />
      </svg>
    ),
    action: (t, cb) => prependLine(t, "> ", cb),
  },
];

// ─── MarkdownEditor component ───────────────────────────────────────────────

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Ecrivez en markdown...",
  rows = 6,
  required,
  minLength,
}: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleToolAction = useCallback(
    (tool: Tool) => {
      if (textareaRef.current) {
        tool.action(textareaRef.current, onChange);
      }
    },
    [onChange]
  );

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod || !textareaRef.current) return;

      if (e.key === "b") {
        e.preventDefault();
        wrapSelection(textareaRef.current, "**", "**", "texte en gras", onChange);
      } else if (e.key === "i") {
        e.preventDefault();
        wrapSelection(textareaRef.current, "*", "*", "texte en italique", onChange);
      }
    },
    [onChange]
  );

  // Group tools with dividers
  let lastGroup = TOOLS[0]?.group;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1.5px solid var(--border)" }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-0.5 px-2 py-1.5"
        style={{
          background: "var(--bg-secondary)",
          borderBottom: "0.5px solid var(--border)",
        }}
      >
        {TOOLS.map((tool, idx) => {
          const showDivider = idx > 0 && tool.group !== lastGroup;
          lastGroup = tool.group;
          return (
            <div key={tool.id} className="flex items-center">
              {showDivider && (
                <div
                  className="w-px h-4 mx-1"
                  style={{ background: "var(--border)" }}
                />
              )}
              <button
                type="button"
                title={tool.title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (mode === "preview") setMode("edit");
                  handleToolAction(tool);
                }}
                className="flex items-center justify-center rounded-lg transition-colors"
                style={{
                  width: "32px",
                  height: "32px",
                  color: "var(--text-tertiary)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.background = "var(--bg-card)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-tertiary)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {tool.icon}
              </button>
            </div>
          );
        })}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Preview toggle */}
        <button
          type="button"
          onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
          className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
          style={{
            color: mode === "preview" ? "var(--green)" : "var(--text-tertiary)",
            background: mode === "preview" ? "var(--green-light-bg)" : "transparent",
          }}
          onMouseEnter={(e) => {
            if (mode !== "preview") {
              e.currentTarget.style.color = "var(--text-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (mode !== "preview") {
              e.currentTarget.style.color = "var(--text-tertiary)";
            }
          }}
        >
          {mode === "preview" ? "Editeur" : "Apercu"}
        </button>
      </div>

      {/* Editor / Preview area */}
      {mode === "edit" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          rows={rows}
          className="w-full px-3.5 py-2.5 text-[14px] outline-none resize-none"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "none",
            display: "block",
          }}
        />
      ) : (
        <div
          className="px-3.5 py-2.5 text-[14px] overflow-auto"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            minHeight: `${rows * 1.5 + 1.25}rem`,
          }}
        >
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-[14px]" style={{ color: "var(--text-tertiary)" }}>
              Rien a afficher...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
