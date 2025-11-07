import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface RecentMovie {
  imdbId: string;
  title: string;
  poster: string;
  rating: string;
}

export default function RecentList() {
  const [recentMovies, setRecentMovies] = useState<RecentMovie[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load recent movies from localStorage
    const storedMovies = localStorage.getItem('recentMovies');
    if (storedMovies) {
      try {
        const movies = JSON.parse(storedMovies);
        setRecentMovies(movies.slice(0, 10)); // Ensure only 10 movies
      } catch (error) {
        console.error('Error parsing recent movies:', error);
      }
    }
  }, []);

  const handleMovieClick = (imdbId: string) => {
    router.push(`/watch/${imdbId}`);
  };

  if (recentMovies.length === 0) {
    return null;
  }

  return (
    <div className="bg-black py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Recently Watched</h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
          {recentMovies.map((movie) => (
            <div
              key={movie.imdbId}
              onClick={() => handleMovieClick(movie.imdbId)}
              className="cursor-pointer group transition-transform duration-300 hover:scale-105"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:brightness-75 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-yellow-500 text-black text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
                  ⭐ {movie.rating}
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3">
                    <svg 
                      className="w-6 h-6 sm:w-8 sm:h-8 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <h3 className="text-white font-medium mt-2 text-xs sm:text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
                {movie.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 