"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

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
  // Split by display math ($$...$$) first, then inline ($...$)
  const parts: React.ReactNode[] = [];
  let remaining = text;
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
              {remaining.slice(0, inlineMatch.index)}
            </span>
          );
        }
        try {
          parts.push(<InlineMath key={key++} math={inlineMatch[1]} />);
        } catch {
          parts.push(<span key={key++} className="text-red-400">{inlineMatch[0]}</span>);
        }
        remaining = remaining.slice(inlineMatch.index + inlineMatch[0].length);
      } else {
        // Display math comes first
        if (matchIdx > 0) {
          parts.push(
            <span key={key++} className="whitespace-pre-wrap">
              {remaining.slice(0, matchIdx)}
            </span>
          );
        }
        try {
          parts.push(<BlockMath key={key++} math={displayMatch[1]} />);
        } catch {
          parts.push(<span key={key++} className="text-red-400">{displayMatch[0]}</span>);
        }
        remaining = remaining.slice(matchIdx + displayMatch[0].length);
      }
    } else if (inlineMatch && inlineMatch.index !== undefined) {
      if (inlineMatch.index > 0) {
        parts.push(
          <span key={key++} className="whitespace-pre-wrap">
            {remaining.slice(0, inlineMatch.index)}
          </span>
        );
      }
      try {
        parts.push(<InlineMath key={key++} math={inlineMatch[1]} />);
      } catch {
        parts.push(<span key={key++} className="text-red-400">{inlineMatch[0]}</span>);
      }
      remaining = remaining.slice(inlineMatch.index + inlineMatch[0].length);
    } else {
      // No more math - render as paragraphs
      const paragraphs = remaining.split("\n\n");
      paragraphs.forEach((p, i) => {
        if (p.trim()) {
          parts.push(
            <span key={key++} className="whitespace-pre-wrap">
              {p}
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
