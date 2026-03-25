"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import React from "react";

/* Sentinels – ASCII SOH (\x01) never appears in normal text or LaTeX */
const S_NL = "\x01NL\x01";   // escaped \\ (double backslash → LaTeX newline)
const S_DS = "\x01DS\x01";   // escaped \$ (literal dollar sign)

/** Replace \\\\ → sentinel, then \\$ → sentinel, BEFORE delimiter matching */
function preprocess(t: string) {
  return t.replace(/\\\\/g, S_NL).replace(/\\\$/g, S_DS);
}
/** Restore sentinels inside plain-text spans */
function restoreText(s: string) {
  return s.replace(/\x01NL\x01/g, "\\\\").replace(/\x01DS\x01/g, "$");
}
/** Restore sentinels inside KaTeX math spans */
function restoreMath(s: string) {
  return s.replace(/\x01NL\x01/g, "\\\\").replace(/\x01DS\x01/g, "\\$");
}

// ── Error boundary to catch KaTeX rendering crashes on mobile ──
class MathErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <span className="text-text-secondary font-mono text-sm break-all">{this.props.fallback}</span>;
    }
    return this.props.children;
  }
}

interface MathRenderProps {
  content: string;
  block?: boolean;
}

export default function MathRender({ content, block = false }: MathRenderProps) {
  // Guard: handle null, undefined, empty
  if (!content || typeof content !== "string") return null;

  if (block) {
    return (
      <MathErrorBoundary fallback={content}>
        <div className="my-2 overflow-x-auto overflow-y-hidden -mx-1 px-1">
          {renderMixedContent(content, true)}
        </div>
      </MathErrorBoundary>
    );
  }
  return (
    <MathErrorBoundary fallback={content}>
      <span className="inline-block max-w-full overflow-x-auto overflow-y-hidden">
        {renderMixedContent(content, false)}
      </span>
    </MathErrorBoundary>
  );
}

function renderMixedContent(text: string, isBlock: boolean) {
  const parts: React.ReactNode[] = [];
  let remaining = preprocess(text);
  let key = 0;

  while (remaining.length > 0) {
    // Check for display math $$...$$
    const displayMatch = remaining.match(/\$\$([\s\S]*?)\$\$/);
    // Check for inline math $...$
    const inlineMatch = remaining.match(/\$((?!\$)[\s\S]*?)\$/);

    if (displayMatch && displayMatch.index !== undefined) {
      const matchIdx = displayMatch.index;

      if (inlineMatch && inlineMatch.index !== undefined && inlineMatch.index < matchIdx) {
        // Inline math comes first
        if (inlineMatch.index > 0) {
          parts.push(
            <span key={key++} className="whitespace-pre-wrap">
              {restoreText(remaining.slice(0, inlineMatch.index))}
            </span>
          );
        }
        try {
          parts.push(<InlineMath key={key++} math={restoreMath(inlineMatch[1])} renderError={(error: Error) => <span className="text-red-400 text-xs" title={error.message}>{restoreText(inlineMatch![0])}</span>} />);
        } catch {
          parts.push(<span key={key++} className="text-red-400">{restoreText(inlineMatch[0])}</span>);
        }
        remaining = remaining.slice(inlineMatch.index + inlineMatch[0].length);
      } else {
        // Display math comes first
        if (matchIdx > 0) {
          parts.push(
            <span key={key++} className="whitespace-pre-wrap">
              {restoreText(remaining.slice(0, matchIdx))}
            </span>
          );
        }
        try {
          parts.push(<BlockMath key={key++} math={restoreMath(displayMatch[1])} renderError={(error: Error) => <span className="text-red-400 text-xs" title={error.message}>{restoreText(displayMatch![0])}</span>} />);
        } catch {
          parts.push(<span key={key++} className="text-red-400">{restoreText(displayMatch[0])}</span>);
        }
        remaining = remaining.slice(matchIdx + displayMatch[0].length);
      }
    } else if (inlineMatch && inlineMatch.index !== undefined) {
      if (inlineMatch.index > 0) {
        parts.push(
          <span key={key++} className="whitespace-pre-wrap">
            {restoreText(remaining.slice(0, inlineMatch.index))}
          </span>
        );
      }
      try {
        parts.push(<InlineMath key={key++} math={restoreMath(inlineMatch[1])} />);
      } catch {
        parts.push(<span key={key++} className="text-red-400">{restoreText(inlineMatch[0])}</span>);
      }
      remaining = remaining.slice(inlineMatch.index + inlineMatch[0].length);
    } else {
      // No more math - render as paragraphs
      const paragraphs = remaining.split("\n\n");
      paragraphs.forEach((p, i) => {
        if (p.trim()) {
          parts.push(
            <span key={key++} className="whitespace-pre-wrap">
              {restoreText(p)}
              {i < paragraphs.length - 1 ? "\n\n" : ""}
            </span>
          );
        }
      });
      remaining = "";
    }
  }

  if (isBlock) {
    return <div className="space-y-1">{parts}</div>;
  }
  return <>{parts}</>;
}
