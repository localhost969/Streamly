import Image from "next/image";

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
}

interface MovieInfoProps {
  movieDetails: MovieDetails;
}

export default function MovieInfo({ movieDetails }: MovieInfoProps) {
  const rottenTomatoesRating = movieDetails.Ratings.find(
    (r) => r.Source === "Rotten Tomatoes"
  )?.Value;
  const metacriticRating = movieDetails.Metascore;

  const getMetacriticColor = (score: string) => {
    if (!score || score === "N/A") return "bg-gray-600";
    const numericScore = parseInt(score, 10);
    if (numericScore >= 61) return "bg-green-500";
    if (numericScore >= 40) return "bg-yellow-500 text-black";
    return "bg-red-500";
  };

  return (
    <section className="bg-gradient-to-b from-gray-950 to-black text-white border-t border-gray-800/50 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Optimized Poster Container */}
          <div className="flex-shrink-0">
            {/* Mobile: Horizontal layout */}
            <div className="flex sm:hidden gap-4 items-start">
              <div className="relative w-24 h-36 rounded-lg overflow-hidden shadow-xl border border-gray-700/50">
              <Image
                src={movieDetails.Poster}
                  alt={`${movieDetails.Title} poster`}
                fill
                className="object-cover"
                  sizes="96px"
                  priority
                />
              </div>
              {/* Mobile title & basic info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold leading-[1.1] mb-2 line-clamp-2 tracking-tight text-gray-50 font-sans">
                  {movieDetails.Title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 mb-3 font-medium">
                  <span className="bg-gray-800/80 px-2 py-1 rounded font-semibold tracking-wide">{movieDetails.Year}</span>
                  <span className="bg-gray-800/80 px-2 py-1 rounded font-semibold tracking-wide">{movieDetails.Rated}</span>
                  <span className="bg-gray-800/80 px-2 py-1 rounded font-semibold tracking-wide">{movieDetails.Runtime}</span>
                </div>
                {/* Genres on mobile (deduplicated) */}
                <div className="flex flex-wrap gap-1 mt-1 mb-1">
                  {[...new Set(movieDetails.Genre.split(", ").map(g => g.trim()))].map((genre, idx) => (
                    <span
                      key={idx}
                      className="border border-gray-600/60 text-gray-200 px-2 py-1 rounded-lg text-[11px] font-medium cursor-default bg-transparent"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tablet & Desktop: Vertical layout */}
            <div className="hidden sm:block">
              <div className="relative w-48 md:w-56 lg:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-gray-700/50">
                <Image
                  src={movieDetails.Poster}
                  alt={`${movieDetails.Title} poster`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Desktop/Tablet Title */}
            <div className="hidden sm:block">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3 tracking-tight text-gray-50 font-sans drop-shadow-lg">
                {movieDetails.Title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-200 mb-4 font-medium">
                <span className="border border-gray-600/60 bg-transparent px-3 py-1 rounded font-bold tracking-wider transition-colors duration-200 cursor-default">{movieDetails.Year}</span>
                <span className="border border-gray-600/60 bg-transparent px-3 py-1 rounded font-bold tracking-wider transition-colors duration-200 cursor-default">{movieDetails.Rated}</span>
                <span className="border border-gray-600/60 bg-transparent px-3 py-1 rounded font-bold tracking-wider transition-colors duration-200 cursor-default">{movieDetails.Runtime}</span>
              </div>
            </div>

            {/* Ratings - New UI (Hidden on mobile) */}
            <div className="hidden sm:block space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-gray-200 tracking-wide uppercase">Ratings</h3>
              <div className="flex flex-wrap items-stretch gap-3 sm:gap-4">
                {/* IMDb */}
                {movieDetails.imdbRating && movieDetails.imdbRating !== "N/A" && (
                  <div className="flex items-center gap-3 border border-gray-600/60 bg-transparent rounded-lg p-2 transition-colors duration-200 cursor-default">
                    <div className="bg-yellow-500 text-black px-2 py-1 rounded font-black text-xs tracking-wider">
                      IMDb
                    </div>
                    <div>
                      <p className="text-white font-bold text-base tracking-tight">{movieDetails.imdbRating}<span className="text-xs text-gray-400 font-medium">/10</span></p>
                      <p className="text-xs text-gray-400 leading-tight font-medium">{movieDetails.imdbVotes} votes</p>
                    </div>
                  </div>
                )}

                {/* Rotten Tomatoes */}
                {rottenTomatoesRating && rottenTomatoesRating !== "N/A" && (
                  <div className="flex items-center gap-3 border border-gray-600/60 bg-transparent rounded-lg p-2 transition-colors duration-200 cursor-default">
                    <div className="text-2xl leading-none">🍅</div>
                    <div>
                      <p className="text-white font-bold text-base tracking-tight">{rottenTomatoesRating}</p>
                      <p className="text-xs text-gray-400 leading-tight font-medium tracking-wide">Tomatometer</p>
                    </div>
                  </div>
                )}

                {/* Metacritic */}
                {metacriticRating && metacriticRating !== "N/A" && (
                  <div className="flex items-center gap-3 border border-gray-600/60 bg-transparent rounded-lg p-2 transition-colors duration-200 cursor-default">
                    <div className={`w-7 h-7 ${getMetacriticColor(metacriticRating)} flex items-center justify-center rounded text-white font-black text-sm`}>
                      {metacriticRating}
                    </div>
                    <div>
                      <p className="text-white font-bold text-base tracking-tight">Metascore</p>
                      <p className="text-xs text-gray-400 leading-tight font-medium tracking-wide">from reviews</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Genres (Hidden on mobile) */}
            <div className="hidden sm:block space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-gray-200 tracking-wide uppercase">Genres</h3>
              <div className="flex flex-wrap gap-2.5">
                {movieDetails.Genre.split(", ").map((genre, idx) => (
                  <span
                    key={idx}
                    className="border border-gray-600/60 text-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 text-xs font-medium cursor-default bg-transparent"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Mobile Ratings Section - Enhanced */}
            <div className="block sm:hidden space-y-3">
              <h3 className="text-sm font-bold text-gray-200 tracking-wide uppercase border-b border-gray-700/50 pb-2">Ratings</h3>
              <div className="space-y-2">
                {/* IMDb Rating */}
                {movieDetails.imdbRating && movieDetails.imdbRating !== "N/A" && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-900/30 border-l-4 border-yellow-500">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-black">IMDb</div>
                      <div>
                        <p className="text-white font-bold text-sm">{movieDetails.imdbRating}/10</p>
                        <p className="text-xs text-gray-400 font-medium">{movieDetails.imdbVotes} votes</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rotten Tomatoes */}
                {rottenTomatoesRating && rottenTomatoesRating !== "N/A" && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-900/30 border-l-4 border-red-500">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">🍅</div>
                      <div>
                        <p className="text-white font-bold text-sm">{rottenTomatoesRating}</p>
                        <p className="text-xs text-gray-400 font-medium">Tomatometer</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Metacritic */}
                {metacriticRating && metacriticRating !== "N/A" && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-900/30 border-l-4 border-green-500">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 ${getMetacriticColor(metacriticRating)} flex items-center justify-center rounded text-xs font-bold text-white`}>
                        {metacriticRating}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Metascore</p>
                        <p className="text-xs text-gray-400 font-medium">Critic reviews</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Plot */}
            <div className="space-y-2">
              <h2 className="text-sm sm:text-lg font-bold text-gray-100 tracking-wide font-sans">Synopsis</h2>
              <p className="text-gray-200 leading-[1.7] text-sm sm:text-base sm:line-clamp-none font-light tracking-wide">
                {movieDetails.Plot}
              </p>
            </div>

            {/* Cast & Crew - Mobile optimized */}
            <div className="space-y-3">
              {/* Mobile version */}
              <div className="block sm:hidden space-y-3">
                <h3 className="text-sm font-bold text-gray-200 tracking-wide uppercase border-b border-gray-700/50 pb-2">Cast & Crew</h3>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-300 text-xs uppercase tracking-wider">Director</span>
                    <span className="text-gray-100 text-sm font-medium leading-relaxed pl-1">{movieDetails.Director}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-300 text-xs uppercase tracking-wider">Starring</span>
                    <span className="text-gray-100 text-sm font-medium leading-relaxed pl-1">{movieDetails.Actors}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-300 text-xs uppercase tracking-wider">Released</span>
                      <span className="text-gray-100 text-sm font-medium pl-1">{movieDetails.Released}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-300 text-xs uppercase tracking-wider">Language</span>
                      <span className="text-gray-100 text-sm font-medium pl-1">{movieDetails.Language}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop/Tablet version */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-bold text-gray-300 text-xs sm:text-sm tracking-wider uppercase">Director:</span>
                      <span className="text-gray-100 line-clamp-1 font-medium">{movieDetails.Director}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-bold text-gray-300 text-xs sm:text-sm tracking-wider uppercase">Stars:</span>
                      <span className="text-gray-100 line-clamp-2 sm:line-clamp-1 font-medium">{movieDetails.Actors}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-bold text-gray-300 text-xs sm:text-sm tracking-wider uppercase">Released:</span>
                      <span className="text-gray-100 font-medium">{movieDetails.Released}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-bold text-gray-300 text-xs sm:text-sm tracking-wider uppercase">Language:</span>
                      <span className="text-gray-100 font-medium">{movieDetails.Language}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Awards - Collapsible on mobile */}
            {movieDetails.Awards && movieDetails.Awards !== "N/A" && (
              <div className="space-y-2 pt-2 border-t border-gray-800/50">
                <h3 className="text-sm sm:text-base font-bold text-gray-200 tracking-wide uppercase">Awards & Recognition</h3>
                <p className="text-gray-200 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none font-medium tracking-wide">
                  {movieDetails.Awards}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}