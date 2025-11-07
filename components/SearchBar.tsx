import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { logSearch } from "../utils/logger";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      try {
        const parsed = JSON.parse(storedSearches);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((s) => typeof s === "string"));
        }
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflowX = 'hidden';
    }
    
    return () => {
      document.body.style.overflowX = '';
    };
  }, [isFocused]);

  const addToRecentSearches = (searchQuery: string) => {
    try {
      const currentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const filteredSearches = currentSearches.filter((s: string) => typeof s === "string" && s !== searchQuery);
      const updatedSearches = [searchQuery, ...filteredSearches].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error('Error updating recent searches:', error);
    }
  };

  const handleSearch = (e?: React.FormEvent, searchQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSearch = searchQuery || query.trim();
    if (queryToSearch) {
      // Log the search query silently (only when search is initiated by user)
      logSearch(queryToSearch);
      addToRecentSearches(queryToSearch);
      
      if (onSearch) {
        onSearch(queryToSearch);
      } else {
        // Default behavior: trigger search on home page
        router.push(`/?search=${encodeURIComponent(queryToSearch)}`);
      }
      setIsFocused(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm overflow-hidden"
          />
        )}
      </AnimatePresence>
      <motion.div
        className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <div className="max-w-2xl mx-auto transition-all duration-300">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search movies..."
                className={`${
                  isFocused 
                    ? "border-transparent ring-4 ring-white/20 shadow-[0_0_28px_-12px_rgba(139,92,246,0.55)]" 
                    : "border-white/30 hover:border-white/50 shadow-[0_0_16px_-8px_rgba(0,0,0,0.4)]"
                } w-full px-5 sm:px-7 py-3.5 sm:py-4 text-white bg-black/90 backdrop-blur-xl border-2 rounded-full focus:outline-none placeholder-gray-400 text-base sm:text-lg font-medium transition-all duration-300 ease-out relative overflow-hidden`}
                style={{
                  background: isFocused 
                    ? 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)' 
                    : 'rgba(0,0,0,0.9)'
                }}
              />
              {isFocused && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-purple-500/20 -z-10 blur-sm"></div>
              )}
              <button
                type="submit"
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-xl group-focus-within:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 right-0 mt-3 bg-black/95 backdrop-blur-xl border-2 border-white/20 rounded-2xl shadow-2xl shadow-black/50 max-h-72 overflow-hidden z-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-gray-500/5 to-gray-500/5 rounded-2xl"></div>
                  <div className="relative z-10">
                    <div className="px-6 py-4 text-sm font-bold text-gray-200 border-b border-white/10 bg-gradient-to-r from-gray-500/10 via-gray-500/10 to-gray-500/10">
                      RECENT SEARCHES
                    </div>
                    <div className="max-h-60 overflow-auto">
                      {recentSearches
                        .filter((search) => typeof search === "string" && search.toLowerCase().includes(query.toLowerCase()))
                        .slice(0, 8)
                        .map((search, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onMouseDown={() => {
                              setQuery(search);
                              handleSearch(undefined, search);
                            }}
                            className="px-6 py-4 hover:bg-gradient-to-r hover:from-gray-600/15 hover:via-gray-600/15 hover:to-gray-600/15 cursor-pointer border-b border-white/5 last:border-0 text-white font-medium transition-all duration-200 flex items-center gap-3"
                          >
                            <svg 
                              className="w-4 h-4 text-gray-400" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {search}
                          </motion.div>
                        ))}
                      {recentSearches.filter((search) => search.toLowerCase().includes(query.toLowerCase())).length === 0 && (
                        <div className="px-6 py-8 text-center text-gray-400 flex flex-col items-center gap-2">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.072-2.327M18 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                          </svg>
                          <span>No recent searches found</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </>
  );
}