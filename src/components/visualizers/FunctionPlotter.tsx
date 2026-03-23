"use client";
import { useRef, useEffect, useState, useCallback } from "react";

interface Props {
  expression: string;
  xMin?: number;
  xMax?: number;
  width?: number;
  height?: number;
}

// Simple math expression parser for Canvas 2D plotting
function evaluateExpr(expr: string, x: number): number {
  const sanitized = expr
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
    const fn = new Function("x", `"use strict"; return (${sanitized});`);
    const val = fn(x);
    return typeof val === "number" && isFinite(val) ? val : NaN;
  } catch {
    return NaN;
  }
}

export default function FunctionPlotter({
  expression,
  xMin = -10,
  xMax = 10,
  width = 600,
  height = 400,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [input, setInput] = useState(expression);
  const [activeExpr, setActiveExpr] = useState(expression);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;

    // Compute y range by sampling
    const samples: number[] = [];
    const step = (xMax - xMin) / 500;
    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateExpr(activeExpr, x);
      if (!isNaN(y)) samples.push(y);
    }
    if (samples.length === 0) return;

    const yMinRaw = Math.min(...samples);
    const yMaxRaw = Math.max(...samples);
    const yRange = yMaxRaw - yMinRaw || 2;
    const yMin = yMinRaw - yRange * 0.1;
    const yMax = yMaxRaw + yRange * 0.1;

    const toCanvasX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (w - 2 * pad);
    const toCanvasY = (y: number) => h - pad - ((y - yMin) / (yMax - yMin)) * (h - 2 * pad);

    // Clear
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "#1a1a2f";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const gx = pad + (i / 10) * (w - 2 * pad);
      ctx.beginPath();
      ctx.moveTo(gx, pad);
      ctx.lineTo(gx, h - pad);
      ctx.stroke();
      const gy = pad + (i / 10) * (h - 2 * pad);
      ctx.beginPath();
      ctx.moveTo(pad, gy);
      ctx.lineTo(w - pad, gy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1.5;
    // X axis
    if (yMin <= 0 && yMax >= 0) {
      const zeroY = toCanvasY(0);
      ctx.beginPath();
      ctx.moveTo(pad, zeroY);
      ctx.lineTo(w - pad, zeroY);
      ctx.stroke();
    }
    // Y axis
    if (xMin <= 0 && xMax >= 0) {
      const zeroX = toCanvasX(0);
      ctx.beginPath();
      ctx.moveTo(zeroX, pad);
      ctx.lineTo(zeroX, h - pad);
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = "#888";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    for (let i = 0; i <= 5; i++) {
      const val = xMin + (i / 5) * (xMax - xMin);
      ctx.fillText(val.toFixed(1), toCanvasX(val), h - pad + 15);
    }
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const val = yMin + (i / 5) * (yMax - yMin);
      ctx.fillText(val.toFixed(1), pad - 5, toCanvasY(val) + 4);
    }

    // Plot function
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    let started = false;
    for (let px = pad; px <= w - pad; px++) {
      const x = xMin + ((px - pad) / (w - 2 * pad)) * (xMax - xMin);
      const y = evaluateExpr(activeExpr, x);
      if (isNaN(y) || !isFinite(y)) {
        started = false;
        continue;
      }
      const cy = toCanvasY(y);
      if (cy < pad - 50 || cy > h - pad + 50) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(px, cy);
        started = true;
      } else {
        ctx.lineTo(px, cy);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Mouse crosshair
    if (mousePos) {
      const mx = xMin + ((mousePos.x - pad) / (w - 2 * pad)) * (xMax - xMin);
      const my = evaluateExpr(activeExpr, mx);
      if (!isNaN(my)) {
        const cy = toCanvasY(my);
        ctx.fillStyle = "#ff2daa";
        ctx.beginPath();
        ctx.arc(mousePos.x, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "12px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`(${mx.toFixed(2)}, ${my.toFixed(2)})`, mousePos.x + 10, cy - 10);
      }
    }
  }, [activeExpr, xMin, xMax, mousePos]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

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
          placeholder="ej: x^2, sin(x), exp(-x^2)"
        />
        <button
          onClick={() => setActiveExpr(input)}
          className="px-3 py-1.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded text-sm hover:bg-neon-cyan/30 transition"
        >
          Graficar
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full rounded-lg border border-gray-800 cursor-crosshair"
        style={{ maxWidth: width }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos(null)}
      />
    </div>
  );
}
