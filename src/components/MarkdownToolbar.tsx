"use client";

import { RefObject } from "react";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
};

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

const TOOLS = [
  {
    label: "G",
    title: "Gras (Ctrl+B)",
    style: { fontWeight: 700 },
    action: (t: HTMLTextAreaElement, cb: (v: string) => void) =>
      wrapSelection(t, "**", "**", "texte en gras", cb),
  },
  {
    label: "I",
    title: "Italique (Ctrl+I)",
    style: { fontStyle: "italic" },
    action: (t: HTMLTextAreaElement, cb: (v: string) => void) =>
      wrapSelection(t, "_", "_", "texte en italique", cb),
  },
  {
    label: "—",
    title: "Liste à puces",
    style: {},
    action: (t: HTMLTextAreaElement, cb: (v: string) => void) =>
      prependLine(t, "- ", cb),
  },
  {
    label: "❝",
    title: "Citation",
    style: {},
    action: (t: HTMLTextAreaElement, cb: (v: string) => void) =>
      prependLine(t, "> ", cb),
  },
];

export function MarkdownToolbar({ textareaRef, onChange }: Props) {
  return (
    <div className="flex items-center gap-1">
      {TOOLS.map((tool) => (
        <button
          key={tool.label}
          type="button"
          title={tool.title}
          onMouseDown={(e) => {
            e.preventDefault();
            if (textareaRef.current) tool.action(textareaRef.current, onChange);
          }}
          className="px-2 py-1 rounded text-[12px] transition-colors hover-bg"
          style={{ color: "var(--text-tertiary)", ...tool.style }}
        >
          {tool.label}
        </button>
      ))}
      <span className="text-[11px] ml-1" style={{ color: "var(--text-tertiary)", opacity: 0.6 }}>
        Markdown supporté
      </span>
    </div>
  );
}
