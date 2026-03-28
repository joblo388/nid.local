"use client";

import { MarkdownRenderer } from "./MarkdownRenderer";

/**
 * Wrapper component that renders markdown content using the built-in
 * regex-based renderer (no external dependencies).
 */
export function MarkdownContent({ content }: { content: string }) {
  return <MarkdownRenderer content={content} />;
}
