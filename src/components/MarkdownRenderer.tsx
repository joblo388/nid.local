"use client";

/**
 * Simple regex-based markdown renderer.
 * No external dependencies — renders markdown to sanitized HTML.
 *
 * Supports: **bold**, *italic*, ## headings (h2, h3), - lists, `inline code`,
 * ```code blocks```, > blockquotes, [links](url), line breaks
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInline(line: string): string {
  // Inline code first (so markers inside code are not processed)
  line = line.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold **text** or __text__
  line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  line = line.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic *text* or _text_ (but not inside words with underscores)
  line = line.replace(/\*(.+?)\*/g, "<em>$1</em>");
  line = line.replace(/(?<!\w)_(.+?)_(?!\w)/g, "<em>$1</em>");

  // Links [text](url)
  line = line.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return line;
}

export function renderMarkdown(raw: string): string {
  // 1. Escape HTML entities first for safety
  const escaped = escapeHtml(raw);

  // 2. Split into lines
  const lines = escaped.split("\n");
  const htmlParts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks: ```...```
    if (line.trimStart().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      htmlParts.push(`<pre><code>${codeLines.join("\n")}</code></pre>`);
      continue;
    }

    // Blank lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Headings: ### h3 first, then ## h2
    if (line.startsWith("### ")) {
      htmlParts.push(`<h3>${renderInline(line.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      htmlParts.push(`<h2>${renderInline(line.slice(3))}</h2>`);
      i++;
      continue;
    }

    // Blockquotes: > text (collect consecutive lines)
    if (line.startsWith("&gt; ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("&gt; ")) {
        quoteLines.push(renderInline(lines[i].slice(5)));
        i++;
      }
      htmlParts.push(`<blockquote><p>${quoteLines.join("<br/>")}</p></blockquote>`);
      continue;
    }

    // Unordered lists: - item (collect consecutive lines)
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${renderInline(lines[i].slice(2))}</li>`);
        i++;
      }
      htmlParts.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // Regular paragraph
    htmlParts.push(`<p>${renderInline(line)}</p>`);
    i++;
  }

  return htmlParts.join("");
}

export function MarkdownRenderer({ content }: { content: string }) {
  const html = renderMarkdown(content);
  return (
    <div
      className="md-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
