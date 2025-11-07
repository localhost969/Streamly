import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import VideoPlayer from "../../components/VideoPlayer";
import MovieInfo from "../../components/MovieInfo";

interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  BoxOffice: string;
  Response: string;
}

// Skeleton Components for lazy loading
const VideoPlayerSkeleton = () => (
  <div className="pt-14">
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4">
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black/60 max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
);

const MovieInfoSkeleton = () => (
  <section className="bg-gradient-to-b from-gray-950 to-black text-white border-t border-gray-800/50">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Poster Skeleton */}
        <div className="flex-shrink-0">
          <div className="flex sm:hidden gap-4 items-start">
            <div className="w-24 h-36 bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-48 md:w-56 lg:w-64 aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-6">
          <div className="hidden sm:block space-y-4">
            <div className="h-8 bg-gray-800 rounded animate-pulse w-3/4"></div>
            <div className="flex gap-3">
              <div className="h-6 w-16 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-4 bg-gray-800 rounded animate-pulse w-20"></div>
            <div className="flex gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-8 w-20 bg-gray-800 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-5 bg-gray-800 rounded animate-pulse w-24"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-800 rounded animate-pulse w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function WatchMovie() {
  const router = useRouter();
  const { id } = router.query;
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchMovieDetails = async () => {
      try {
        // Add a small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${id}&plot=full`
        );
        const data = await response.json();
        
        if (data.Response === "True") {
          setMovieDetails(data);
          // Add to recent movies
          addToRecentMovies(data);
          // Simulate progressive loading
          setTimeout(() => setContentLoaded(true), 200);
        } else {
          setError(data.Error || "Movie not found");
        }
      } catch (err) {
        setError("Failed to fetch movie details");
        console.error("Error fetching movie details:", err);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Handle browser back button - redirect to home page
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      router.push('/');
    };

    // Override browser back button behavior
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  const addToRecentMovies = (movie: MovieDetails) => {
    try {
      const recentMovies = JSON.parse(localStorage.getItem('recentMovies') || '[]');
      
      // Remove if already exists
      const filteredMovies = recentMovies.filter((m: any) => m.imdbId !== movie.imdbID);
      
      // Add to beginning
      const newRecentMovie = {
        imdbId: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster,
        rating: movie.imdbRating
      };
      
      const updatedMovies = [newRecentMovie, ...filteredMovies].slice(0, 10);
      localStorage.setItem('recentMovies', JSON.stringify(updatedMovies));
    } catch (error) {
      console.error('Error updating recent movies:', error);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 pb-16">
        <div className="text-center">
          <div className="text-red-500 text-lg sm:text-xl mb-4">{error}</div>
          <button
            onClick={handleGoHome}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{movieDetails?.Title ? `${movieDetails.Title} - Streamly` : 'Loading... - Streamly'}</title>
        <meta name="description" content={movieDetails?.Plot || "Loading movie details..."} />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black relative pb-20">
        {/* Background unified with VideoPlayer section */}

        {/* Floating Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-5xl px-2 sm:px-3 lg:px-6">
            <div className="mt-3 sm:mt-4 rounded-2xl bg-black/60 backdrop-blur-xl shadow-lg shadow-violet-500/10">
              <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2">
                <button
                  onClick={handleGoHome}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 hover:shadow hover:shadow-violet-500/20"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="hidden xs:inline">Home</span>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="truncate text-sm sm:text-base font-semibold text-white/90">
                      {movieDetails?.Title || 'Loading...'}
                    </h2>
                    
                  </div>
                </div>

                {movieDetails?.Year && (
                  <span className="inline-flex rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-white/70">
                    {movieDetails.Year}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progressive Loading Content */}
        <div className="pt-6 sm:pt-20">
          {!movieDetails ? (
            <>
              <VideoPlayerSkeleton />
              <MovieInfoSkeleton />
            </>
          ) : (
            <div
              className={`transition-all duration-700 ease-out ${
                contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <VideoPlayer imdbId={id as string} contentType={movieDetails.Type} />
              <MovieInfo movieDetails={movieDetails} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}