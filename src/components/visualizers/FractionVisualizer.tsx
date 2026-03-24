"use client";
import { useRef, useEffect, useState } from "react";
import { getCanvasTheme } from "./canvasTheme";

interface Props {
  initialNumerator?: number;
  initialDenominator?: number;
}

export default function FractionVisualizer({ initialNumerator = 3, initialDenominator = 4 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [num, setNum] = useState(initialNumerator);
  const [den, setDen] = useState(initialDenominator);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const tc = getCanvasTheme();
    ctx.fillStyle = tc.bg;
    ctx.fillRect(0, 0, w, h);

    const barWidth = w - 80;
    const barHeight = 50;
    const startX = 40;

    // Full bar (reference)
    const yRef = 60;
    ctx.fillStyle = tc.grid;
    ctx.fillRect(startX, yRef, barWidth, barHeight);
    ctx.strokeStyle = tc.axis;
    ctx.strokeRect(startX, yRef, barWidth, barHeight);
    ctx.fillStyle = tc.label;
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("1 (entero)", startX + barWidth / 2, yRef - 10);

    // Fraction bar
    const yFrac = 160;
    const partWidth = barWidth / Math.max(den, 1);

    for (let i = 0; i < Math.max(den, 1); i++) {
      const x = startX + i * partWidth;
      if (i < num) {
        ctx.fillStyle = tc.accent;
        ctx.shadowColor = tc.accent;
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = tc.grid;
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(x + 1, yFrac, partWidth - 2, barHeight);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = tc.axis;
      ctx.strokeRect(x + 1, yFrac, partWidth - 2, barHeight);
    }

    ctx.fillStyle = tc.text;
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${num}/${den}`, startX + barWidth / 2, yFrac + barHeight + 30);

    // Decimal
    const decimal = den > 0 ? (num / den).toFixed(4) : "∞";
    ctx.fillStyle = tc.accent4;
    ctx.font = "14px monospace";
    ctx.fillText(`= ${decimal}`, startX + barWidth / 2, yFrac + barHeight + 55);

    // Percentage bar
    const yPct = yFrac + barHeight + 80;
    const pct = den > 0 ? Math.min(num / den, 1) : 0;
    ctx.fillStyle = tc.grid;
    ctx.fillRect(startX, yPct, barWidth, 20);
    ctx.fillStyle = tc.accent3;
    ctx.shadowColor = tc.accent3;
    ctx.shadowBlur = 6;
    ctx.fillRect(startX, yPct, barWidth * pct, 20);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = tc.axis;
    ctx.strokeRect(startX, yPct, barWidth, 20);
    ctx.fillStyle = tc.text;
    ctx.font = "12px monospace";
    ctx.fillText(`${(pct * 100).toFixed(1)}%`, startX + barWidth / 2, yPct + 40);
  }, [num, den]);

  return (
    <div className="space-y-3">
      <div className="flex gap-4 items-center justify-center">
        <div className="flex flex-col items-center gap-1">
          <label className="text-xs text-text-muted">Numerador</label>
          <input
            type="range"
            min={0}
            max={Math.max(den, 1) * 2}
            value={num}
            onChange={(e) => setNum(Number(e.target.value))}
            className="accent-neon-cyan"
          />
          <span className="text-neon-cyan font-mono text-lg">{num}</span>
        </div>
        <span className="text-text-primary text-2xl font-bold mt-4">/</span>
        <div className="flex flex-col items-center gap-1">
          <label className="text-xs text-text-muted">Denominador</label>
          <input
            type="range"
            min={1}
            max={24}
            value={den}
            onChange={(e) => setDen(Number(e.target.value))}
            className="accent-neon-purple"
          />
          <span className="text-neon-purple font-mono text-lg">{den}</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={380}
        className="w-full rounded-lg border border-text-muted/20"
        style={{ maxWidth: 500 }}
      />
    </div>
  );
}
