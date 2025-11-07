import { useEffect, useMemo, useState } from "react";

interface SeriesPlayerProps {
  imdbId: string;
}

interface Season {
  season: string;
  episodeCount: number;
}

interface Episode {
  id: string;
  title: string;
  primaryImage?: {
    url?: string;
    width?: number;
    height?: number;
  } | null;
  season: string;
  episodeNumber: number;
  plot: string;
  rating?: {
    aggregateRating: number;
    voteCount: number;
  } | null;
  releaseDate: {
    year: number;
    month: number;
    day: number;
  };
}

export default function SeriesPlayer({ imdbId }: SeriesPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [seasonsError, setSeasonsError] = useState(false);
  const [episodesError, setEpisodesError] = useState(false);
  const [episodeQuery, setEpisodeQuery] = useState("");

  const fallbackImage = "/img.png";

  const isError = seasonsError || episodesError;

  const getImageUrl = (ep: Episode | null): string => {
    if (!ep) return fallbackImage;
    return ep.primaryImage?.url || fallbackImage;
  };

  const seasonNumbers = useMemo(
    () =>
      seasons
        .map((s) => parseInt(s.season))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b),
    [seasons]
  );

  const filteredEpisodes = useMemo(() => {
    const q = episodeQuery.trim().toLowerCase();
    if (!q) return episodes;
    return episodes.filter((ep) => (ep.title || "").toLowerCase().includes(q));
  }, [episodes, episodeQuery]);

  useEffect(() => {
    if (!imdbId) return;
    fetchSeasons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imdbId]);

  useEffect(() => {
    if (!imdbId || !season) return;
    fetchEpisodes(season);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imdbId, season]);

  const fetchSeasons = async () => {
    setLoadingSeasons(true);
    setSeasonsError(false);
    try {
      const response = await fetch(`https://api.imdbapi.dev/titles/${imdbId}/seasons`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const data = await response.json();
      if (data?.seasons && Array.isArray(data.seasons) && data.seasons.length > 0) {
        setSeasons(data.seasons);
        const firstSeason = parseInt(data.seasons[0]?.season) || 1;
        setSeason(firstSeason);
      } else {
        setSeasonsError(true);
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setSeasonsError(true);
    } finally {
      setLoadingSeasons(false);
    }
  };

  const fetchEpisodes = async (seasonNumber: number) => {
    setLoadingEpisodes(true);
    setEpisodesError(false);
    try {
      const response = await fetch(
        `https://api.imdbapi.dev/titles/${imdbId}/episodes?season=${seasonNumber}&pageSize=40`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const data = await response.json();
      if (data?.episodes && Array.isArray(data.episodes) && data.episodes.length > 0) {
        const validEpisodes: Episode[] = data.episodes
          .filter((ep: any) => ep && ep.id && ep.title && ep.episodeNumber)
          .map((ep: any) => ({
            ...ep,
            plot: ep.plot || "No description available.",
            primaryImage: ep.primaryImage || null,
            rating: ep.rating || null,
            releaseDate:
              ep.releaseDate || { year: new Date().getFullYear(), month: 1, day: 1 },
          }));

        setEpisodes(validEpisodes);

        if (isInitialLoad && validEpisodes.length > 0) {
          // Select the latest released episode
          const releasedEpisodes = validEpisodes.filter(isEpisodeReleased);
          const firstEpisode = releasedEpisodes.length > 0 ? releasedEpisodes[releasedEpisodes.length - 1] : null;
          if (firstEpisode) {
            setSelectedEpisode(firstEpisode);
            setEpisode(firstEpisode.episodeNumber || 1);
          }
          setIsInitialLoad(false);
        }
      } else {
        setEpisodesError(true);
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
      setEpisodesError(true);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  const getVideoSrc = useMemo(() => {
    const s = selectedEpisode ? selectedEpisode.season : season;
    const e = selectedEpisode ? selectedEpisode.episodeNumber : episode;
    return `${process.env.NEXT_PUBLIC_VIDSRC_DOMAIN}/embed/tv?imdb=${imdbId}&season=${s}&episode=${e}`;
  }, [imdbId, selectedEpisode, season, episode]);

  const handleEpisodeSelect = (ep: Episode) => {
    if (!isEpisodeReleased(ep)) return; // Prevent selecting unreleased episodes
    setSelectedEpisode(ep);
    setEpisode(ep.episodeNumber || 1);
    setSeason(parseInt(ep.season) || 1);
    setIsLoaded(false); // Keep this to reload only on episode click
  };

  const getCurrentEpisodeIndex = () => {
    if (!selectedEpisode) return -1;
    return episodes.findIndex((ep) => ep.id === selectedEpisode.id);
  };

  const goToPreviousEpisode = () => {
    const idx = getCurrentEpisodeIndex();
    if (idx > 0) {
      handleEpisodeSelect(episodes[idx - 1]);
    }
  };

  const goToNextEpisode = () => {
    const idx = getCurrentEpisodeIndex();
    if (idx >= 0 && idx < episodes.length - 1) {
      handleEpisodeSelect(episodes[idx + 1]);
    }
  };

  const formatDate = (date: { year: number; month: number; day: number }) => {
    try {
      return new Date(date.year, date.month - 1, date.day).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  const isEpisodeReleased = (ep: Episode): boolean => {
    const releaseDate = new Date(ep.releaseDate.year, ep.releaseDate.month - 1, ep.releaseDate.day);
    const now = new Date();
    return releaseDate <= now;
  };

  const skeletonCount = 8; // Number of skeleton items to display

  return (
    <section className="bg-gradient-to-b from-gray-950 to-black text-white font-sans">
      <div className="pt-5 pb-8 sm:pt-6 sm:pb-10">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-6">
          <div className="flex flex-col xl:flex-row gap-3 sm:gap-6">
            {/* Player */}
            <div className="flex-1 mt-12 sm:mt-0">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/60">
                {/* Loader */}
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500/20 via-fuchsia-500/20 to-sky-500/20 blur-xl" />
                      <div className="text-center">
                        <div className="text-white text-base sm:text-lg font-semibold mb-1">
                          Loading S{selectedEpisode ? selectedEpisode.season : season}E
                          {(selectedEpisode ? selectedEpisode.episodeNumber : episode)
                            .toString()
                            .padStart(2, "0")}
                        </div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <iframe
                  key={`${imdbId}-${selectedEpisode ? selectedEpisode.season : season}-${selectedEpisode ? selectedEpisode.episodeNumber : episode}`}
                  src={getVideoSrc}
                  className={`w-full h-full transition-all duration-700 ease-out ${
                    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  title={`TV Series Player - S${selectedEpisode ? selectedEpisode.season : season}E${selectedEpisode ? selectedEpisode.episodeNumber : episode}`}
                  onLoad={() => setIsLoaded(true)}
                />

                {/* Subtle chrome */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,rgba(0,0,0,0.5))]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/30 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Now Playing Info */}
              {selectedEpisode && (
                <div className="mt-4 sm:mt-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-3 sm:p-5 lg:p-6 shadow-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-3 sm:gap-5">
                    

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-300">
                          Now Playing
                        </span>
                        <span className="text-xs text-white/70">S{selectedEpisode.season}E{(selectedEpisode.episodeNumber || 0).toString().padStart(2, "0")}</span>
                      </div>
                      <h3 className="text-white font-black text-base sm:text-lg lg:text-xl leading-tight mb-1 line-clamp-2 font-sans">
                        {selectedEpisode.title || "Unknown Episode"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/80 mb-3">
                        {selectedEpisode.rating?.aggregateRating && (
                          <span className="inline-flex items-center gap-1 text-yellow-300">
                            ⭐ {selectedEpisode.rating.aggregateRating}
                            <span className="text-white/50">({(selectedEpisode.rating.voteCount || 0).toLocaleString()})</span>
                          </span>
                        )}
                        <span className="text-white/70">{formatDate(selectedEpisode.releaseDate)}</span>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed line-clamp-4">
                        {selectedEpisode.plot || "No description available."}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={goToPreviousEpisode}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs sm:text-sm font-medium text-white transition-all hover:bg-white/10 hover:shadow hover:shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={getCurrentEpisodeIndex() <= 0}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Prev
                        </button>
                        <button
                          onClick={goToNextEpisode}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs sm:text-sm font-medium text-white transition-all hover:bg-white/10 hover:shadow hover:shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={getCurrentEpisodeIndex() < 0 || getCurrentEpisodeIndex() >= episodes.length - 1}
                        >
                          Next
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full xl:w-96">
              {/* Error State */}
              {isError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-4 sm:p-6 shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-red-300 font-bold text-base mb-2">Failed to Load Episodes</h3>
                      <p className="text-red-200/80 text-sm mb-4 leading-relaxed">
                        {seasonsError && episodesError
                          ? "Unable to load seasons and episodes information."
                          : seasonsError
                          ? "Unable to load seasons information."
                          : "Unable to load episodes information."}
                        {" "}The video player will still work, but episode details and navigation won't be available.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Navigation when error */}
              {isError && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-6 shadow-xl">
                  <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                      />
                    </svg>
                    Manual Navigation
                  </h4>
                  <p className="text-white/80 text-sm mb-4">Manually select season and episode to continue watching:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Season</label>
                      <div className="relative">
                        <select
                          value={season}
                          onChange={(e) => {
                            setSeason(parseInt(e.target.value));
                            setIsLoaded(false);
                          }}
                          className="w-full bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-white/10 text-white rounded-xl px-3 py-3 pr-10 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 hover:border-white/20 transition-all duration-300 font-medium text-sm appearance-none cursor-pointer"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a855f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                            backgroundPosition: "right 0.75rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1rem",
                          }}
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((seasonNum) => (
                            <option key={seasonNum} value={seasonNum} className="bg-gray-900 text-white py-2">
                              Season {seasonNum}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <div className="w-4 h-4 rounded-full bg-violet-500/20 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Episode</label>
                      <div className="relative">
                        <select
                          value={episode}
                          onChange={(e) => {
                            setEpisode(parseInt(e.target.value));
                            setIsLoaded(false);
                          }}
                          className="w-full bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-white/10 text-white rounded-xl px-3 py-3 pr-10 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 hover:border-white/20 transition-all duration-300 font-medium text-sm appearance-none cursor-pointer"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a855f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                            backgroundPosition: "right 0.75rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1rem",
                          }}
                        >
                          {Array.from({ length: 25 }, (_, i) => i + 1).map((episodeNum) => (
                            <option key={episodeNum} value={episodeNum} className="bg-gray-900 text-white py-2">
                              Episode {episodeNum}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <div className="w-4 h-4 rounded-full bg-violet-500/20 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
                    <div className="flex items-center gap-2 text-violet-200 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Currently playing: Season {season}, Episode {episode}
                    </div>
                  </div>
                </div>
              )}

              {/* Normal Episodes UI */}
              {!isError && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-xl p-3 sm:p-4 lg:p-5">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                   
                  </div>

                  {/* Seasons Selection - Redesigned for Mobile */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white/90 font-bold text-sm"></h4>
                      
                    </div>
                    
                    {loadingSeasons ? (
                      <div className="flex items-center gap-3 text-white/70 text-sm py-3">
                        <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                        Loading seasons...
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Mobile: Vertical Stack */}
                        <div className="block sm:hidden">
                          <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30 transition-colors">
                            <div className="grid grid-cols-4 gap-2 p-1">
                              {seasonNumbers.map((sNum) => (
                                <button
                                  key={sNum}
                                  onClick={() => {
                                    setSeason(sNum); // Only change season, no reload
                                    // Removed setIsLoaded(false) to keep player constant
                                  }}
                                  className={`relative flex items-center justify-center rounded-lg border px-2 py-2.5 text-sm font-medium transition-all ${
                                    season === sNum
                                      ? "border-violet-400/60 bg-gradient-to-br from-violet-500/20 to-purple-600/20 text-violet-200 shadow-lg shadow-violet-500/20"
                                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white/90"
                                  }`}
                                >
                                  <span className="text-xs font-semibold">S{sNum}</span>
                                  {season === sNum && (
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/10 via-transparent to-purple-500/10 animate-pulse" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Desktop/Tablet: Horizontal Scroll */}
                        <div className="hidden sm:block">
                          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30 transition-colors pb-2">
                            {seasonNumbers.map((sNum) => (
                              <button
                                key={sNum}
                                onClick={() => {
                                  setSeason(sNum); // Only change season, no reload
                                  // Removed setIsLoaded(false) to keep player constant
                                }}
                                className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-all whitespace-nowrap min-w-[60px] ${
                                  season === sNum
                                    ? "border-violet-400/60 bg-gradient-to-r from-violet-500/20 to-purple-600/20 text-violet-200 shadow-md shadow-violet-500/20"
                                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
                                }`}
                              >
                                S{sNum}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search */}
                  <div className="mb-3">
                    <div className="relative">
                      <input
                        value={episodeQuery}
                        onChange={(e) => setEpisodeQuery(e.target.value)}
                        placeholder="Search episodes..."
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Episodes List */}
                  <div className="rounded-xl border border-white/10 bg-black/20">
                    <div className="p-3 sm:p-4 border-b border-white/10">
                      <h4 className="text-white/90 font-bold text-sm sm:text-base flex items-center gap-2">
                        <span className="w-1 h-4 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></span>
                        Season {season}
                      </h4>
                    </div>

                    <div className="max-h-64 sm:max-h-96 xl:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30 transition-colors">
                      {loadingEpisodes ? (
                        <ul className="divide-y divide-white/5">
                          {Array.from({ length: skeletonCount }, (_, i) => (
                            <li key={i} className="p-2.5 sm:p-3">
                              <div className="flex items-center gap-3 sm:gap-4">
                                {/* Skeleton Image */}
                                <div className="w-16 h-10 sm:w-20 sm:h-12 bg-gray-700 animate-pulse rounded-md border border-white/10"></div>
                                <div className="min-w-0 flex-1">
                                  {/* Skeleton Title */}
                                  <div className="h-4 bg-gray-700 animate-pulse rounded mb-2"></div>
                                  {/* Skeleton Metadata */}
                                  <div className="h-3 bg-gray-700 animate-pulse rounded w-3/4"></div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : filteredEpisodes.length === 0 ? (
                        <div className="p-6 text-white/60 text-sm">No episodes match your search.</div>
                      ) : (
                        <ul className="divide-y divide-white/5">
                          {filteredEpisodes.map((ep) => (
                            <li key={ep.id}>
                              <button
                                onClick={() => handleEpisodeSelect(ep)}
                                disabled={!isEpisodeReleased(ep)}
                                className={`w-full flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 text-left transition-all ${
                                  selectedEpisode?.id === ep.id
                                    ? "border-l-4 border-violet-500"
                                    : "hover:bg-white/5"
                                } ${!isEpisodeReleased(ep) ? "opacity-40 cursor-not-allowed" : ""}`}
                              >
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={getImageUrl(ep)}
                                    alt={ep.title || "Episode"}
                                    className="w-16 h-10 sm:w-20 sm:h-12 object-cover rounded-md border border-white/10"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      if (target.src !== fallbackImage) target.src = fallbackImage;
                                    }}
                                  />
                                  {selectedEpisode?.id === ep.id && (
                                    <div className="absolute inset-0 rounded-md bg-violet-500/20" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start gap-2">
                                    <span
                                      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium flex-shrink-0 ${
                                        selectedEpisode?.id === ep.id
                                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                                          : "bg-white/5 text-white/70 border border-white/10"
                                      }`}
                                    >
                                      EP {(ep.episodeNumber || 0).toString().padStart(2, "0")}
                                    </span>
                                    <p className="text-white font-medium text-xs sm:text-sm line-clamp-2 min-w-0 leading-snug">
                                      {ep.title || "Unknown Episode"}
                                    </p>
                                  </div>
                                  <div className="mt-1 flex items-center gap-2 text-[11px] sm:text-xs text-white/60">
                                    {ep.rating?.aggregateRating && (
                                      <span className="inline-flex items-center gap-1 text-yellow-300">
                                        ⭐ {ep.rating.aggregateRating}
                                      </span>
                                    )}
                                    <span>{formatDate(ep.releaseDate)}</span>
                                  </div>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 2px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          transition: background-color 0.2s ease;
        }
        
        .scrollbar-thin:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .hover\\:scrollbar-thumb-white\/30:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </section>
  );
}


