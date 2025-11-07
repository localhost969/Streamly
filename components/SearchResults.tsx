import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface Movie {
  id: string;
  type: string;
  // Updated API uses camelCase
  primaryTitle?: string;
  originalTitle?: string;
  primaryImage?: {
    url?: string;
    width?: number;
    height?: number;
  };
  startYear?: number;
  endYear?: number;
  // Legacy fields kept optional for backward compatibility
  primary_title?: string;
  original_title?: string;
  primary_image?: {
    url?: string;
    width?: number;
    height?: number;
  };
  start_year?: number;
  end_year_legacy?: number;
  genres?: string[];
  rating?: {
    aggregateRating?: number;
    voteCount?: number;
    votesCount?: number;
  };
  runtimeMinutes?: number;
  runtime_minutes?: number;
  plot?: string;
  isAdult?: boolean;
  is_adult?: boolean;
}

interface SearchResponse {
  titles: Movie[];
  next_page_token?: string;
}

interface SearchResultsProps {
  query: string;
  onClearSearch: () => void;
}

// Skeleton Components for lazy loading
const SearchHeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
    <div className="space-y-3">
      <div className="h-8 sm:h-9 bg-gray-800 rounded animate-pulse w-64 sm:w-80"></div>
      <div className="h-4 bg-gray-800 rounded animate-pulse w-32"></div>
    </div>
    <div className="h-10 w-32 bg-gray-800 rounded animate-pulse"></div>
  </div>
);

const MovieCardSkeleton = () => (
  <div className="group relative">
    <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 animate-pulse">
      {/* Smooth shimmer overlay */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'shimmer 1.5s infinite ease-in-out',
          transform: 'translateX(-100%)',
        }}
      />
      {/* Skeleton play button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-600/50 flex items-center justify-center">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      {/* Skeleton rating badge */}
      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-12 h-5 sm:w-14 sm:h-6 bg-gray-600 rounded animate-pulse"></div>
    </div>
    
    <div className="mt-2 space-y-2">
      <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
      <div className="h-3 bg-gray-800 rounded animate-pulse w-3/4"></div>
      <div className="flex gap-1">
        <div className="h-5 w-12 bg-gray-800 rounded animate-pulse"></div>
        <div className="h-5 w-16 bg-gray-800 rounded animate-pulse"></div>
      </div>
    </div>
    {/* Inline keyframes for shimmer animation */}
    <style jsx>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

const SearchResultsSkeleton = () => (
  <div className="min-h-screen bg-black pt-20 sm:pt-20 pb-6 sm:pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SearchHeaderSkeleton />
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
        {Array.from({ length: 21 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </div>
  </div>
);

export default function SearchResults({ query, onClearSearch }: SearchResultsProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) return;

    const searchMovies = async () => {
      try {
        setIsSearching(true);
        setContentLoaded(false);
        setError(null);
        
        // Add a small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = await fetch(
          `https://api.imdbapi.dev/search/titles?query=${encodeURIComponent(query)}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data: SearchResponse = await response.json();
        
        // Filter out adult content and non-movies/series
        const filteredMovies = data.titles.filter(movie => 
          // Exclude adult content if flag present (supports both legacy and new fields)
          !((movie.is_adult ?? movie.isAdult) === true) &&
          (movie.type === 'movie' || movie.type === 'tvSeries')
        );
        
        setMovies(filteredMovies);
        // Progressive loading effect
        setTimeout(() => setContentLoaded(true), 200);
      } catch (err) {
        setError('Failed to search movies. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    };

    searchMovies();
  }, [query]);

  const handleMovieClick = (movieId: string) => {
    router.push(`/watch/${movieId}`);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // Show skeleton while searching
  if (isSearching) {
    return <SearchResultsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-black pt-16 sm:pt-20 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Search Header with Back Button */}
        <div className={`flex items-center justify-between mb-6 sm:mb-8 transition-all duration-500 ease-out ${
          contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base font-medium hidden xs:inline">Back</span>
          </button>

          <div className="flex-1 mx-4 sm:mx-6 min-w-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white truncate">
              Search Results
            </h1>
            {!error && (
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                "{query}" • {movies.length} {movies.length === 1 ? 'result' : 'results'}
              </p>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-red-500 text-base sm:text-lg md:text-xl mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!error && movies.length === 0 && (
          <div className={`text-center py-12 sm:py-16 transition-all duration-500 ease-out ${
            contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="text-gray-400 text-base sm:text-lg md:text-xl mb-4">
              No movies found for "{query}"
            </div>
            <button
              onClick={handleBackToHome}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Search Results with Staggered Animation */}
        {!error && movies.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${
                  contentLoaded 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: contentLoaded ? `${index * 50}ms` : '0ms',
                  transitionDuration: '600ms'
                }}
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
                  {(movie.primaryImage?.url || movie.primary_image?.url) ? (
                    <Image
                      src={(movie.primaryImage?.url || movie.primary_image?.url) as string}
                      alt={movie.primaryTitle || movie.primary_title || movie.originalTitle || movie.original_title || 'Poster'}
                      fill
                      className="object-cover group-hover:brightness-75 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      No Image
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Rating Badge */}
                  {movie.rating?.aggregateRating && (
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-yellow-500 text-black text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
                      ⭐ {movie.rating.aggregateRating.toFixed(1)}
                    </div>
                  )}
                  
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
                
                <div className="mt-2">
                  <h3 className="text-white font-medium text-xs sm:text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {movie.primaryTitle || movie.primary_title || movie.originalTitle || movie.original_title || 'Untitled'}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-400 text-xs">{movie.startYear ?? movie.start_year ?? ''}</span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-gray-400 text-xs capitalize">{movie.type}</span>
                  </div>
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.genres.slice(0, 2).map((genre, index) => (
                        <span 
                          key={index}
                          className="bg-gray-800 text-gray-300 text-xs px-1.5 py-0.5 rounded text-[10px] sm:text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
