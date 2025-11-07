import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Film, Tv, PlayCircle, RefreshCw, Zap } from "lucide-react";

interface HeroSectionProps {
  onStartWatching: () => void;
  onSearch: (query: string) => void;
}

export default function HeroSection({ onStartWatching, onSearch }: HeroSectionProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleStartWatching = () => {
    onStartWatching();
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput("");
    }
  };

  return (
    <div className="relative w-full hidden sm:block">
      {/* Hero Section with original height */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {/* Mobile Background Image */}
          <Image
            src="/v1.webp"
            alt="Hollywood Movies Collection"
            fill
            className="object-cover object-center sm:hidden"
            priority
            quality={90}
          />
          {/* Desktop Background Image */}
          <Image
            src="/new-d.jpg"
            alt="Hollywood Movies Collection"
            fill
            className="object-cover object-center hidden sm:block"
            priority
            quality={90}
          />
        </div>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-full w-full mx-auto px-4 sm:px-6 lg:px-8"
          >
            <h1 className="text-5xl xs:text-6xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-sans text-white mb-6 sm:mb-6 lg:mb-8 leading-tight xs:leading-tight sm:leading-tight tracking-[3] drop-shadow-2xl">
              <span className="block">Unlimited Movies,</span>
              <span className="block">Shows and More </span>
              <span className="block"></span>
            </h1>
            <p className="text-xl xs:text-2xl sm:text-xl md:text-2xl text-gray-100 mb-8 sm:mb-8 lg:mb-10 font-sans font-medium leading-relaxed drop-shadow-lg">
               Stream seamlessly across all your devices.
            </p>
            
            {/* Search Bar - moved just above the button */}
            <form onSubmit={handleSearchSubmit} className="flex justify-center mb-6">
              <div className="flex w-full max-w-md gap-2">
                <div className="flex-1 relative inline-flex rounded-full p-[2px] focus-within:bg-violet-500 transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Search movies, shows..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-full bg-black text-white font-sans text-base border border-gray-700 focus:outline-none"
                    style={{ backgroundColor: 'var(--background)' }}
                  />
                </div>
            {/* Theme-colored animated outline, inside kept as before */}
                <button
                  type="submit"
                  className="group relative inline-flex rounded-full p-[2px] bg-[length:300%_300%] bg-[linear-gradient(90deg,#8B5CF6,#3B82F6,#A855F7,#8B5CF6)] animate-gradient-x shadow-[0_0_28px_-12px_rgba(139,92,246,0.55)] hover:shadow-[0_0_36px_-10px_rgba(139,92,246,0.65)] transition-[transform,box-shadow] duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <span className="relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-black rounded-full">
                    <span className="relative z-10 font-semibold">
                      Search
                    </span>
                  </span>
                </button>
              </div>
            </form>


          </motion.div>
        </div>
        
        {/* Mobile-specific professional gradient below content */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent sm:hidden"></div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="relative bg-black py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Film className="w-12 h-12 text-violet-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">Movies</h3>
              <p className="text-lg text-gray-300">#88040</p>
            </div>
            <div className="text-center">
              <Tv className="w-12 h-12 text-violet-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">Series</h3>
              <p className="text-lg text-gray-300">#19185</p>
            </div>
            <div className="text-center">
              <PlayCircle className="w-12 h-12 text-violet-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">Episodes</h3>
              <p className="text-lg text-gray-300">#462925</p>
            </div>
          </div>

          {/* Auto-Updated */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <RefreshCw className="w-8 h-8 text-violet-500 mr-3" />
              <h3 className="text-3xl font-bold text-white">Auto-Updated</h3>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
              Links are automatically updated with new or better quality as soon as they are available on OTT.
            </p>
          </div>

          {/* Quality */}
          <div>
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-violet-500 mr-3" />
              <h3 className="text-3xl font-bold text-white">Quality</h3>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
              The quality of the links is the latest available. For the record 80% of the files are 1080p.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scoped animation for flowing gradient border (production-friendly, reduced-motion aware) */}
      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient-x {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}