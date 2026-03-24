"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { getCanvasTheme } from "./canvasTheme";

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

interface Props {
  expression?: string;
  xMin?: number;
  xMax?: number;
  initialA?: number;
  initialB?: number;
}

export default function IntegralVisualizer({
  expression = "x^2",
  xMin = -1,
  xMax = 4,
  initialA = 0,
  initialB = 2,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [input, setInput] = useState(expression);
  const [activeExpr, setActiveExpr] = useState(expression);
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);

  // Numerical integration (Simpson's rule)
  const integrate = useCallback((expr: string, from: number, to: number) => {
    const n = 200;
    const h = (to - from) / n;
    let sum = evalExpr(expr, from) + evalExpr(expr, to);
    for (let i = 1; i < n; i++) {
      const coeff = i % 2 === 0 ? 2 : 4;
      sum += coeff * evalExpr(expr, from + i * h);
    }
    return (h / 3) * sum;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;

    const samples: number[] = [];
    for (let x = xMin; x <= xMax; x += (xMax - xMin) / 500) {
      const y = evalExpr(activeExpr, x);
      if (!isNaN(y)) samples.push(y);
    }
    if (!samples.length) return;

    const yMinR = Math.min(...samples, 0);
    const yMaxR = Math.max(...samples, 0);
    const yr = yMaxR - yMinR || 2;
    const yMin = yMinR - yr * 0.1;
    const yMax = yMaxR + yr * 0.1;

    const toX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (w - 2 * pad);
    const toY = (y: number) => h - pad - ((y - yMin) / (yMax - yMin)) * (h - 2 * pad);

    const tc = getCanvasTheme();

    ctx.fillStyle = tc.bg;
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = tc.grid;
    for (let i = 0; i <= 10; i++) {
      const gx = pad + (i / 10) * (w - 2 * pad);
      ctx.beginPath(); ctx.moveTo(gx, pad); ctx.lineTo(gx, h - pad); ctx.stroke();
      const gy = pad + (i / 10) * (h - 2 * pad);
      ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(w - pad, gy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = tc.axis;
    ctx.lineWidth = 1.5;
    if (yMin <= 0 && yMax >= 0) {
      ctx.beginPath(); ctx.moveTo(pad, toY(0)); ctx.lineTo(w - pad, toY(0)); ctx.stroke();
    }
    if (xMin <= 0 && xMax >= 0) {
      ctx.beginPath(); ctx.moveTo(toX(0), pad); ctx.lineTo(toX(0), h - pad); ctx.stroke();
    }

    // Shaded area
    const aReal = Math.min(a, b);
    const bReal = Math.max(a, b);
    ctx.fillStyle = tc.accent3 + "33";
    ctx.strokeStyle = tc.accent3 + "80";
    ctx.beginPath();
    ctx.moveTo(toX(aReal), toY(0));
    for (let x = aReal; x <= bReal; x += (bReal - aReal) / 200) {
      const y = evalExpr(activeExpr, x);
      if (!isNaN(y)) ctx.lineTo(toX(x), toY(y));
    }
    ctx.lineTo(toX(bReal), toY(0));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Boundary lines
    ctx.strokeStyle = tc.accent3;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    [aReal, bReal].forEach((bx) => {
      ctx.beginPath();
      ctx.moveTo(toX(bx), toY(0));
      ctx.lineTo(toX(bx), toY(evalExpr(activeExpr, bx)));
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Plot function
    ctx.strokeStyle = tc.accent;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = tc.accent;
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

    // Labels
    ctx.fillStyle = tc.accent3;
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`a = ${a.toFixed(1)}`, toX(a), toY(0) + 15);
    ctx.fillText(`b = ${b.toFixed(1)}`, toX(b), toY(0) + 15);

    // Integral value
    const integral = integrate(activeExpr, a, b);
    ctx.fillStyle = tc.text;
    ctx.font = "bold 16px monospace";
    ctx.fillText(`∫ f(x)dx ≈ ${integral.toFixed(4)}`, w / 2, pad + 20);
  }, [activeExpr, xMin, xMax, a, b, integrate]);

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
          className="flex-1 bg-bg-secondary border border-text-muted/30 rounded px-3 py-1.5 text-text-primary font-mono text-sm focus:border-neon-cyan outline-none"
        />
        <button onClick={() => setActiveExpr(input)} className="px-3 py-1.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded text-sm hover:bg-neon-cyan/30 transition">OK</button>
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-sm text-text-muted">a:</label>
          <input type="range" min={xMin * 10} max={xMax * 10} value={a * 10}
            onChange={(e) => setA(Number(e.target.value) / 10)} className="flex-1 accent-neon-green" />
          <span className="text-neon-green font-mono w-12">{a.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <label className="text-sm text-text-muted">b:</label>
          <input type="range" min={xMin * 10} max={xMax * 10} value={b * 10}
            onChange={(e) => setB(Number(e.target.value) / 10)} className="flex-1 accent-neon-green" />
          <span className="text-neon-green font-mono w-12">{b.toFixed(1)}</span>
        </div>
      </div>
      <canvas ref={canvasRef} width={600} height={400}
        className="w-full rounded-lg border border-text-muted/20" style={{ maxWidth: 600 }} />
      <div className="text-xs text-text-muted text-center">
        El área <span className="text-neon-green">verde</span> representa $\int_a^b f(x)\,dx$.
      </div>
    </div>
  );
}
