/** Reads current theme CSS variables and returns canvas-friendly colors. */
export function getCanvasTheme() {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string) => s.getPropertyValue(name).trim();

  return {
    bg:      v("--bg-secondary")   || "#0a0a0f",
    grid:    v("--text-muted")     ? v("--text-muted") + "30" : "#1a1a2f",
    axis:    v("--text-secondary") || "#444",
    label:   v("--text-muted")     || "#888",
    text:    v("--text-primary")   || "#fff",
    accent:  v("--neon-cyan")      || "#00f0ff",
    accent2: v("--neon-pink")      || "#ff2daa",
    accent3: v("--neon-green")     || "#00ff88",
    accent4: v("--neon-purple")    || "#b24bff",
  };
}
