"use client";
import { useRef, useEffect, useState, useCallback } from "react";

// Reuse the same safe evaluator
function evalExpr(expr: string, x: number): number {
  const s = expr
    .replace(/\^/g, "**")
    .replace(/sin/g, "Math.sin")
    .replace(/cos/g, "Math.cos")
    .replace(/tan/g, "Math.tan")
    .replace(/sqrt/g, "Math.sqrt")
    .replace(/abs/g, "Math.abs")
    .replace(/log/g, "Math.log10")
    .replace(/ln/g, "Math.log")
    .replace(/exp/g, "Math.exp")
    .replace(/pi/g, "Math.PI")
    .replace(/e(?![xpa])/g, "Math.E");
  try {
    const fn = new Function("x", `"use strict"; return (${s});`);
    const v = fn(x);
    return typeof v === "number" && isFinite(v) ? v : NaN;
  } catch {
    return NaN;
  }
}

// Numerical derivative
function numDerivative(expr: string, x: number): number {
  const h = 0.0001;
  return (evalExpr(expr, x + h) - evalExpr(expr, x - h)) / (2 * h);
}

interface Props {
  expression?: string;
  xMin?: number;
  xMax?: number;
}

export default function DerivativeVisualizer({
  expression = "x^3-3*x",
  xMin = -3,
  xMax = 3,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [input, setInput] = useState(expression);
  const [activeExpr, setActiveExpr] = useState(expression);
  const [tangentX, setTangentX] = useState(1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;

    // Sample y range
    const samples: number[] = [];
    for (let x = xMin; x <= xMax; x += (xMax - xMin) / 500) {
      const y = evalExpr(activeExpr, x);
      if (!isNaN(y)) samples.push(y);
    }
    if (!samples.length) return;

    const yMinR = Math.min(...samples);
    const yMaxR = Math.max(...samples);
    const yr = yMaxR - yMinR || 2;
    const yMin = yMinR - yr * 0.15;
    const yMax = yMaxR + yr * 0.15;

    const toX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (w - 2 * pad);
    const toY = (y: number) => h - pad - ((y - yMin) / (yMax - yMin)) * (h - 2 * pad);

    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "#1a1a2f";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const gx = pad + (i / 10) * (w - 2 * pad);
      ctx.beginPath(); ctx.moveTo(gx, pad); ctx.lineTo(gx, h - pad); ctx.stroke();
      const gy = pad + (i / 10) * (h - 2 * pad);
      ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(w - pad, gy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1.5;
    if (yMin <= 0 && yMax >= 0) {
      ctx.beginPath(); ctx.moveTo(pad, toY(0)); ctx.lineTo(w - pad, toY(0)); ctx.stroke();
    }
    if (xMin <= 0 && xMax >= 0) {
      ctx.beginPath(); ctx.moveTo(toX(0), pad); ctx.lineTo(toX(0), h - pad); ctx.stroke();
    }

    // Plot function
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    let started = false;
    for (let px = pad; px <= w - pad; px++) {
      const x = xMin + ((px - pad) / (w - 2 * pad)) * (xMax - xMin);
      const y = evalExpr(activeExpr, x);
      if (isNaN(y)) { started = false; continue; }
      const cy = toY(y);
      if (cy < pad - 50 || cy > h - pad + 50) { started = false; continue; }
      if (!started) { ctx.moveTo(px, cy); started = true; } else ctx.lineTo(px, cy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tangent line
    const yAtX = evalExpr(activeExpr, tangentX);
    const slope = numDerivative(activeExpr, tangentX);
    if (!isNaN(yAtX) && !isNaN(slope)) {
      const tangentLen = (xMax - xMin) * 0.3;
      const x1 = tangentX - tangentLen;
      const x2 = tangentX + tangentLen;
      const y1 = yAtX + slope * (x1 - tangentX);
      const y2 = yAtX + slope * (x2 - tangentX);

      ctx.strokeStyle = "#ff2daa";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#ff2daa";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(toX(x1), toY(y1));
      ctx.lineTo(toX(x2), toY(y2));
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Point
      ctx.fillStyle = "#00ff88";
      ctx.shadowColor = "#00ff88";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(toX(tangentX), toY(yAtX), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Info
      ctx.fillStyle = "#fff";
      ctx.font = "13px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`x = ${tangentX.toFixed(2)}`, pad + 5, pad + 15);
      ctx.fillText(`f(x) = ${yAtX.toFixed(3)}`, pad + 5, pad + 32);
      ctx.fillStyle = "#ff2daa";
      ctx.fillText(`f'(x) = ${slope.toFixed(3)}`, pad + 5, pad + 49);
    }
  }, [activeExpr, xMin, xMax, tangentX]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <span className="text-neon-cyan font-mono text-sm mt-2">f(x) =</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setActiveExpr(input)}
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-white font-mono text-sm focus:border-neon-cyan outline-none"
        />
        <button onClick={() => setActiveExpr(input)} className="px-3 py-1.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded text-sm hover:bg-neon-cyan/30 transition">
          Graficar
        </button>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">Punto tangente:</label>
        <input
          type="range"
          min={xMin * 100}
          max={xMax * 100}
          value={tangentX * 100}
          onChange={(e) => setTangentX(Number(e.target.value) / 100)}
          className="flex-1 accent-neon-pink"
        />
        <span className="text-neon-pink font-mono w-16 text-right">{tangentX.toFixed(2)}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full rounded-lg border border-gray-800 cursor-crosshair"
        style={{ maxWidth: 600 }}
      />
      <div className="text-xs text-gray-500 text-center">
        La línea <span className="text-neon-pink">rosa</span> es la recta tangente. Su pendiente = f&apos;(x).
      </div>
    </div>
  );
}
