import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Film, Tv, PlayCircle, RefreshCw, Zap } from "lucide-react";

interface MobileHeroSectionProps {
  onStartWatching: () => void;
  onSearch: (query: string) => void;
}

export default function MobileHeroSection({ onStartWatching, onSearch }: MobileHeroSectionProps) {
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
    <div className="relative w-full sm:hidden">
      {/* Mobile Hero Section - reduced height */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/new-d.jpg"
            alt="Hollywood Movies Collection"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60"></div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-full w-full mx-auto"
          >
            <h1 className="text-4xl xs:text-5xl font-bold font-sans text-white mb-4 leading-tight drop-shadow-2xl">
              <span className="block">Unlimited Movies,</span>
              <span className="block">Shows and More</span>
            </h1>
            <p className="text-lg xs:text-xl text-gray-100 mb-6 font-sans font-medium leading-relaxed drop-shadow-lg">
              Stream seamlessly across all your devices.
            </p>

            <form onSubmit={handleSearchSubmit} className="flex justify-center mb-6 px-0">
              <div className="flex flex-row w-full gap-2 items-center max-w-sm">
                <div className="relative flex-1 flex rounded-full p-[2px] focus-within:bg-violet-500 transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Search movies, shows..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full px-4 py-2 rounded-full bg-black text-white font-sans text-sm border border-gray-700 focus:outline-none"
                    style={{ backgroundColor: 'var(--background)' }}
                  />
                </div>
                <button
                  type="submit"
                  className="group relative flex-shrink-0 rounded-full p-[2px] bg-[length:300%_300%] bg-[linear-gradient(90deg,#8B5CF6,#3B82F6,#A855F7,#8B5CF6)] animate-gradient-x shadow-[0_0_28px_-12px_rgba(139,92,246,0.55)] hover:shadow-[0_0_36px_-10px_rgba(139,92,246,0.65)] transition-[transform,box-shadow] duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-black rounded-full">
                    <span className="relative z-10 font-semibold">
                      Search
                    </span>
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="relative bg-black py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="max-w-full w-full mx-auto"
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <Film className="w-8 h-8 mx-auto mb-2" style={{ color: '#8B5CF6' }} />
              <h3 className="text-lg font-bold text-white">Movies</h3>
              <p className="text-sm text-gray-300">#88040</p>
            </div>
            <div className="text-center">
              <Tv className="w-8 h-8 mx-auto mb-2" style={{ color: '#8B5CF6' }} />
              <h3 className="text-lg font-bold text-white">Series</h3>
              <p className="text-sm text-gray-300">#19185</p>
            </div>
            <div className="text-center">
              <PlayCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#8B5CF6' }} />
              <h3 className="text-lg font-bold text-white">Episodes</h3>
              <p className="text-sm text-gray-300">#462925</p>
            </div>
          </div>

          {/* Auto-Updated */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <RefreshCw className="w-6 h-6 mr-2" style={{ color: '#8B5CF6' }} />
              <h3 className="text-lg font-bold text-white">Auto-Updated</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Links are automatically updated with new or better quality as soon as they are available on OTT.
            </p>
          </div>

          {/* Quality */}
          <div>
            <div className="flex items-center mb-2">
              <Zap className="w-6 h-6 mr-2" style={{ color: '#8B5CF6' }} />
              <h3 className="text-lg font-bold text-white">Quality</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              The quality of the links is the latest available. For the record 80% of the files are 1080p.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Animation styles */}
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
