export default function ScrollIndicator() {
  return (
    <div className="pointer-events-none absolute bottom-12 left-1/2 z-20 -translate-x-1/2 text-slate-300">
      <div className="flex flex-col items-center gap-2">
        <svg width="28" height="44" viewBox="0 0 28 44" fill="none" aria-hidden="true">
          <rect x="1.25" y="1.25" width="25.5" height="41.5" rx="12.75" stroke="currentColor" strokeWidth="2.5" />
          <circle id="wheel" cx="14" cy="10" r="3" fill="currentColor" />
        </svg>
        <span className="text-xs">Scroll</span>
      </div>
      <style jsx>{`
        @keyframes wheel {
          0% { transform: translateY(0); opacity: 1; }
          70% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        #wheel { animation: wheel 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { #wheel { animation: none; } }
      `}</style>
    </div>
  );
}
