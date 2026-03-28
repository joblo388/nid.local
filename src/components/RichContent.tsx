"use client";

import { useMemo } from "react";
import { MarkdownContent } from "./MarkdownContent";
import { LinkPreview } from "./LinkPreview";

// Match common URLs — starts with http(s):// or www.
// Avoids trailing punctuation that's likely not part of the URL
const URL_REGEX =
  /(?:https?:\/\/|www\.)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/[^\s<>{}|\\^`[\]]*[^\s<>{}|\\^`[\].,;:!?'")}\]])?/g;

const MAX_PREVIEWS = 2;

function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  if (!matches) return [];

  // Deduplicate and normalise
  const seen = new Set<string>();
  const urls: string[] = [];

  for (const raw of matches) {
    // Add protocol if missing (www. URLs)
    const url = raw.startsWith("http") ? raw : `https://${raw}`;
    if (!seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
    if (urls.length >= MAX_PREVIEWS) break;
  }

  return urls;
}

export function RichContent({ content }: { content: string }) {
  const urls = useMemo(() => extractUrls(content), [content]);

  return (
    <div>
      <MarkdownContent content={content} />
      {urls.length > 0 && (
        <div className="mt-2 space-y-2">
          {urls.map((url) => (
            <LinkPreview key={url} url={url} />
          ))}
        </div>
      )}
    </div>
  );
}
