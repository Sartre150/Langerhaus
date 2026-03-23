"use client";
import { useRef, useEffect, useState, useCallback } from "react";

export default function UnitCircleVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45); // degrees

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 60;

    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "#1a1a2f";
    ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i += 0.5) {
      ctx.beginPath();
      ctx.moveTo(cx + i * r, cy - r - 20);
      ctx.lineTo(cx + i * r, cy + r + 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - r - 20, cy + i * r);
      ctx.lineTo(cx + r + 20, cy + i * r);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - r - 30, cy);
    ctx.lineTo(cx + r + 30, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - r - 30);
    ctx.lineTo(cx, cy + r + 30);
    ctx.stroke();

    // Circle
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Angle arc
    const rad = (angle * Math.PI) / 180;
    ctx.strokeStyle = "#b24bff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, -rad, rad > 0);
    ctx.stroke();

    // Radius line
    const px = cx + r * Math.cos(rad);
    const py = cy - r * Math.sin(rad);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Point on circle
    ctx.fillStyle = "#ff2daa";
    ctx.shadowColor = "#ff2daa";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // cos line (horizontal projection)
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // sin line (vertical projection)
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";

    ctx.fillStyle = "#00f0ff";
    ctx.fillText(`cos = ${Math.cos(rad).toFixed(3)}`, (cx + px) / 2, cy + 20);

    ctx.fillStyle = "#00ff88";
    ctx.fillText(`sin = ${Math.sin(rad).toFixed(3)}`, px + 55, (cy + py) / 2);

    const tanVal = Math.cos(rad) !== 0 ? Math.tan(rad) : Infinity;
    ctx.fillStyle = "#b24bff";
    ctx.fillText(`tan = ${isFinite(tanVal) ? tanVal.toFixed(3) : "∞"}`, cx, cy + r + 45);

    ctx.fillStyle = "#ff2daa";
    ctx.fillText(`θ = ${angle}° = ${(rad).toFixed(3)} rad`, cx, cy - r - 15);

    // Axis labels
    ctx.fillStyle = "#666";
    ctx.font = "12px monospace";
    ctx.fillText("0", cx + r + 15, cy + 15);
    ctx.fillText("π/2", cx + 10, cy - r - 5);
    ctx.fillText("π", cx - r - 15, cy + 15);
    ctx.fillText("3π/2", cx + 10, cy + r + 15);

    // Key angles
    const keyAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
    keyAngles.forEach((a) => {
      const arad = (a * Math.PI) / 180;
      const dx = cx + (r + 5) * Math.cos(arad);
      const dy = cy - (r + 5) * Math.sin(arad);
      ctx.fillStyle = a === angle ? "#ff2daa" : "#333";
      ctx.beginPath();
      ctx.arc(dx, dy, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [angle]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 justify-center">
        <label className="text-sm text-gray-400">Ángulo:</label>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="flex-1 max-w-xs accent-neon-pink"
        />
        <span className="text-neon-pink font-mono w-16 text-right">{angle}°</span>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {[0, 30, 45, 60, 90, 120, 135, 180, 270, 360].map((a) => (
          <button
            key={a}
            onClick={() => setAngle(a % 360)}
            className={`px-2 py-1 text-xs rounded border transition ${
              angle === a % 360
                ? "bg-neon-pink/20 border-neon-pink text-neon-pink"
                : "border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {a}°
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full rounded-lg border border-gray-800"
        style={{ maxWidth: 500, margin: "0 auto", display: "block" }}
      />
    </div>
  );
}
