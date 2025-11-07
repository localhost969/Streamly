import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HeroSection from "../components/HeroSection";
import MobileHeroSection from "../components/MobileHeroSection";
import RecentList from "../components/RecentList";
import SearchResults from "../components/SearchResults";
import { logIPView } from "../utils/logger";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hasRecentMovies, setHasRecentMovies] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Log IP view on initial page load
    logIPView();
    
    // Check for recent movies
    const storedMovies = localStorage.getItem('recentMovies');
    if (storedMovies) {
      try {
        const movies = JSON.parse(storedMovies);
        setHasRecentMovies(movies.length > 0);
      } catch (error) {
        console.error('Error parsing recent movies:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Check if there's a search query in the URL
    const urlSearchQuery = router.query.search as string;
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [router.query.search]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(true);
    // Update URL without navigation
    router.replace(`/?search=${encodeURIComponent(query)}`, undefined, { shallow: true });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    router.push('/');
  };

  const handleStartWatching = () => {
    // Focus on search input in hero section after a brief delay to ensure it's rendered
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder="Search movies, shows..."]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  return (
    <>
      <Head>
        <title>Streamly - Unlimited Movies & TV Shows</title>
        <meta name="description" content="Stream unlimited movies and TV shows instantly on your browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-black">
        {showSearchResults ? (
          <SearchResults 
            query={searchQuery} 
            onClearSearch={handleClearSearch}
          />
        ) : (
          <>
            <HeroSection onStartWatching={handleStartWatching} onSearch={handleSearch}  />
            <MobileHeroSection onStartWatching={handleStartWatching} onSearch={handleSearch}  />
            <RecentList />
          </>
        )}
      </div>
    </>
  );
}
