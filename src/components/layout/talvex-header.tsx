export const TalvexHeader = () => {
  return (
    <header className="relative isolate flex h-20 items-center justify-between gap-6 border-b border-border/60 bg-[#0b1020] px-8 text-white shadow-[0_15px_45px_rgba(11,16,32,0.35)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.18),transparent_55%)]" />
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/20">
          <img src="/talvex-logo-dark.png" alt="Talvex Studio" className="h-8 w-8 object-contain brightness-0 invert" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.55em] text-indigo-200/80">Talvex Studio</p>
          <p className="text-2xl font-semibold leading-tight tracking-tight">Blocks Laboratory</p>
        </div>
      </div>

      <div className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] uppercase tracking-[0.5em] text-slate-400">Status</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" aria-hidden />
            Realtime Massing Beta
          </span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] uppercase tracking-[0.5em] text-slate-400">Mode</span>
          <span>Parametric Blocks</span>
        </div>
      </div>

      <div className="flex flex-col items-end text-right text-xs uppercase tracking-[0.4em] text-slate-300">
        <span>Context Suite</span>
        <span className="text-sm font-semibold tracking-[0.2em] text-white">v0.1</span>
      </div>
    </header>
  );
};
