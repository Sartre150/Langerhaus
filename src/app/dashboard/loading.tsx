export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Cargando dashboard...</p>
      </div>
    </div>
  );
}
