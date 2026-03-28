"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{children}</strong>
        ),
        em: ({ children }) => <em style={{ color: "var(--text-secondary)" }}>{children}</em>,
        ul: ({ children }) => (
          <ul className="mb-3 pl-5 space-y-1 list-disc" style={{ color: "var(--text-secondary)" }}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 pl-5 space-y-1 list-decimal" style={{ color: "var(--text-secondary)" }}>
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-opacity hover:opacity-70"
            style={{ color: "var(--green)" }}
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote
            className="pl-3 my-3 italic"
            style={{ borderLeft: "3px solid var(--border-secondary)", color: "var(--text-tertiary)" }}
          >
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");
          return isBlock ? (
            <pre
              className="rounded-lg px-4 py-3 my-3 overflow-x-auto text-[12px]"
              style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}
            >
              <code style={{ color: "var(--text-primary)" }}>{children}</code>
            </pre>
          ) : (
            <code
              className="px-1.5 py-0.5 rounded text-[12px]"
              style={{ background: "var(--bg-secondary)", color: "var(--green-text)" }}
            >
              {children}
            </code>
          );
        },
        h2: ({ children }) => (
          <h2 className="text-[15px] font-semibold mt-4 mb-2" style={{ color: "var(--text-primary)" }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[13px] font-semibold mt-3 mb-1.5" style={{ color: "var(--text-primary)" }}>
            {children}
          </h3>
        ),
        hr: () => <hr className="my-4" style={{ borderColor: "var(--border)" }} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
