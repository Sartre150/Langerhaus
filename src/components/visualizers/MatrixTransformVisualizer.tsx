"use client";
import { useRef, useEffect, useState, useCallback } from "react";

export default function MatrixTransformVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [matrix, setMatrix] = useState({ a: 2, b: 0, c: 0, d: 1 });
  const [preset, setPreset] = useState("custom");

  const presets: Record<string, { a: number; b: number; c: number; d: number; label: string }> = {
    identity: { a: 1, b: 0, c: 0, d: 1, label: "Identidad" },
    scale: { a: 2, b: 0, c: 0, d: 2, label: "Escala 2x" },
    rotate90: { a: 0, b: -1, c: 1, d: 0, label: "Rotación 90°" },
    rotate45: { a: 0.707, b: -0.707, c: 0.707, d: 0.707, label: "Rotación 45°" },
    shearX: { a: 1, b: 1, c: 0, d: 1, label: "Cizalla X" },
    reflection: { a: -1, b: 0, c: 0, d: 1, label: "Reflexión Y" },
    projection: { a: 1, b: 0, c: 0, d: 0, label: "Proyección X" },
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 40;

    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "#1a1a2f";
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
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    const { a: ma, b: mb, c: mc, d: md } = matrix;

    // Unit square (original - faded)
    const origPts: [number, number][] = [[0, 0], [1, 0], [1, 1], [0, 1]];
    ctx.strokeStyle = "rgba(136, 136, 136, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    origPts.forEach(([x, y], i) => {
      const px = cx + x * scale;
      const py = cy - y * scale;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Transformed square
    const transPts = origPts.map(([x, y]) => [ma * x + mb * y, mc * x + md * y] as [number, number]);
    ctx.fillStyle = "rgba(0, 240, 255, 0.1)";
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    transPts.forEach(([x, y], i) => {
      const px = cx + x * scale;
      const py = cy - y * scale;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Basis vectors - original
    const drawArrow = (fx: number, fy: number, tx: number, ty: number, color: string) => {
      const sx = cx + fx * scale;
      const sy = cy - fy * scale;
      const ex = cx + tx * scale;
      const ey = cy - ty * scale;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      const angle = Math.atan2(sy - ey, sx - ex);
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + 10 * Math.cos(angle + 0.4), ey + 10 * Math.sin(angle + 0.4));
      ctx.lineTo(ex + 10 * Math.cos(angle - 0.4), ey + 10 * Math.sin(angle - 0.4));
      ctx.closePath();
      ctx.fill();
    };

    // e1 original (faded)
    ctx.globalAlpha = 0.3;
    drawArrow(0, 0, 1, 0, "#ff2daa");
    drawArrow(0, 0, 0, 1, "#00ff88");
    ctx.globalAlpha = 1;

    // Transformed basis vectors
    drawArrow(0, 0, ma, mc, "#ff2daa");
    drawArrow(0, 0, mb, md, "#00ff88");

    // Labels
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = "#ff2daa";
    ctx.fillText(`Ae₁ = (${ma.toFixed(1)}, ${mc.toFixed(1)})`, cx + ma * scale + 10, cy - mc * scale);
    ctx.fillStyle = "#00ff88";
    ctx.fillText(`Ae₂ = (${mb.toFixed(1)}, ${md.toFixed(1)})`, cx + mb * scale + 10, cy - md * scale);

    // Det
    const det = ma * md - mb * mc;
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`det(A) = ${det.toFixed(3)}`, w - 10, 20);
    ctx.fillStyle = det > 0 ? "#00ff88" : det < 0 ? "#ff2daa" : "#888";
    ctx.font = "12px monospace";
    ctx.fillText(det > 0 ? "Preserva orientación" : det < 0 ? "Invierte orientación" : "Singular (colapsa)", w - 10, 38);
  }, [matrix]);

  useEffect(() => { draw(); }, [draw]);

  const applyPreset = (key: string) => {
    setPreset(key);
    if (presets[key]) {
      const { a, b, c, d } = presets[key];
      setMatrix({ a, b, c, d });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(presets).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className={`px-2 py-1 text-xs rounded border transition ${
              preset === key
                ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                : "border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2 items-center">
        <span className="text-gray-400 text-sm">A =</span>
        <div className="grid grid-cols-2 gap-1 border border-gray-700 rounded p-2">
          {(["a", "b", "c", "d"] as const).map((k) => (
            <input
              key={k}
              type="number"
              step={0.1}
              value={matrix[k]}
              onChange={(e) => { setMatrix({ ...matrix, [k]: Number(e.target.value) }); setPreset("custom"); }}
              className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-sm font-mono text-center"
            />
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} width={500} height={500}
        className="w-full rounded-lg border border-gray-800"
        style={{ maxWidth: 500, margin: "0 auto", display: "block" }} />
      <div className="text-xs text-gray-500 text-center">
        <span className="text-neon-pink">Rosa</span> = Ae₁, <span className="text-neon-green">Verde</span> = Ae₂. Líneas punteadas = vectores originales.
      </div>
    </div>
  );
}
