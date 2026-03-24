"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { getCanvasTheme } from "./canvasTheme";

export default function VectorVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [v1, setV1] = useState({ x: 3, y: 2 });
  const [v2, setV2] = useState({ x: 1, y: 4 });
  const [showSum, setShowSum] = useState(true);
  const [showDot, setShowDot] = useState(true);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 35;

    const tc = getCanvasTheme();

    ctx.fillStyle = tc.bg;
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = tc.grid;
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * scale, 0);
      ctx.lineTo(cx + i * scale, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, cy + i * scale);
      ctx.lineTo(w, cy + i * scale);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = tc.axis;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Arrow drawing helper
    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
      const sx = cx + fromX * scale;
      const sy = cy - fromY * scale;
      const ex = cx + toX * scale;
      const ey = cy - toY * scale;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(sy - ey, sx - ex);
      const headLen = 12;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + headLen * Math.cos(angle + 0.4), ey + headLen * Math.sin(angle + 0.4));
      ctx.lineTo(ex + headLen * Math.cos(angle - 0.4), ey + headLen * Math.sin(angle - 0.4));
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "left";
      ctx.fillText(label, ex + 8, ey - 8);
    };

    // Vector 1
    drawArrow(0, 0, v1.x, v1.y, tc.accent, `v₁(${v1.x},${v1.y})`);

    // Vector 2
    drawArrow(0, 0, v2.x, v2.y, tc.accent4, `v₂(${v2.x},${v2.y})`);

    // Sum vector
    if (showSum) {
      const sum = { x: v1.x + v2.x, y: v1.y + v2.y };
      // Parallelogram
      ctx.strokeStyle = tc.accent2 + "4d";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx + v1.x * scale, cy - v1.y * scale);
      ctx.lineTo(cx + sum.x * scale, cy - sum.y * scale);
      ctx.moveTo(cx + v2.x * scale, cy - v2.y * scale);
      ctx.lineTo(cx + sum.x * scale, cy - sum.y * scale);
      ctx.stroke();
      ctx.setLineDash([]);

      drawArrow(0, 0, sum.x, sum.y, tc.accent2, `v₁+v₂(${sum.x},${sum.y})`);
    }

    // Dot product info
    if (showDot) {
      const dot = v1.x * v2.x + v1.y * v2.y;
      const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
      const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
      const cosAngle = mag1 && mag2 ? dot / (mag1 * mag2) : 0;
      const angleDeg = (Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180) / Math.PI;

      ctx.fillStyle = tc.text;
      ctx.font = "13px monospace";
      ctx.textAlign = "left";
      const infoX = 10;
      let infoY = 20;
      ctx.fillText(`v₁ · v₂ = ${dot.toFixed(2)}`, infoX, infoY); infoY += 18;
      ctx.fillText(`|v₁| = ${mag1.toFixed(2)}`, infoX, infoY); infoY += 18;
      ctx.fillText(`|v₂| = ${mag2.toFixed(2)}`, infoX, infoY); infoY += 18;
      ctx.fillStyle = tc.accent3;
      ctx.fillText(`θ = ${angleDeg.toFixed(1)}°`, infoX, infoY); infoY += 18;
      ctx.fillStyle = dot === 0 ? tc.accent3 : tc.label;
      ctx.fillText(dot === 0 ? "⊥ ORTOGONALES" : "", infoX, infoY);
    }
  }, [v1, v2, showSum, showDot]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-neon-cyan">Vector 1</label>
          <div className="flex gap-2">
            <input type="number" value={v1.x} onChange={(e) => setV1({ ...v1, x: Number(e.target.value) })}
              className="w-16 bg-bg-secondary border border-text-muted/30 rounded px-2 py-1 text-text-primary text-sm font-mono text-center" />
            <input type="number" value={v1.y} onChange={(e) => setV1({ ...v1, y: Number(e.target.value) })}
              className="w-16 bg-bg-secondary border border-text-muted/30 rounded px-2 py-1 text-text-primary text-sm font-mono text-center" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-neon-purple">Vector 2</label>
          <div className="flex gap-2">
            <input type="number" value={v2.x} onChange={(e) => setV2({ ...v2, x: Number(e.target.value) })}
              className="w-16 bg-bg-secondary border border-text-muted/30 rounded px-2 py-1 text-text-primary text-sm font-mono text-center" />
            <input type="number" value={v2.y} onChange={(e) => setV2({ ...v2, y: Number(e.target.value) })}
              className="w-16 bg-bg-secondary border border-text-muted/30 rounded px-2 py-1 text-text-primary text-sm font-mono text-center" />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={showSum} onChange={() => setShowSum(!showSum)} className="accent-neon-pink" />
          <span className="text-sm text-text-muted">Suma</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={showDot} onChange={() => setShowDot(!showDot)} className="accent-neon-green" />
          <span className="text-sm text-text-muted">Info prod. punto</span>
        </label>
      </div>
      <canvas ref={canvasRef} width={500} height={500}
        className="w-full rounded-lg border border-text-muted/20"
        style={{ maxWidth: 500, margin: "0 auto", display: "block" }} />
    </div>
  );
}
