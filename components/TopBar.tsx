interface TopBarProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

// Clean top bar with back button on left and movie info on right
export default function TopBar({ title, subtitle, onBack }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="flex items-center justify-between px-4 py-1 md:px-6 lg:px-8 xl:px-12 h-8 md:h-10">
        {/* Left: Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2 py-1 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-md border border-white/20 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Go back"
        >
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          <span className="text-xs font-medium text-white hidden sm:inline">Back</span>
        </button>

        {/* Right: Movie Title & Year */}
        <div className="text-right min-w-0 flex-shrink-0 max-w-xs">
          <h1 className="text-xs md:text-sm font-semibold text-white leading-none truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[10px] md:text-xs text-white/60 mt-0.5 truncate font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
} 