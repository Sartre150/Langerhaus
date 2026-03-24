"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

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

interface MathRenderProps {
  content: string;
  block?: boolean;
}

export default function MathRender({ content, block = false }: MathRenderProps) {
  if (block) {
    return (
      <div className="my-2">
        {renderMixedContent(content, true)}
      </div>
    );
  }
  return <span>{renderMixedContent(content, false)}</span>;
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
          parts.push(<InlineMath key={key++} math={restoreMath(inlineMatch[1])} />);
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
          parts.push(<BlockMath key={key++} math={restoreMath(displayMatch[1])} />);
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
