/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Film, 
  Heart, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  SearchX,
  Clapperboard,
  HeartOff
} from "lucide-react";
import { Movie } from "./types";
import Header from "./components/Header";
import MovieCard from "./components/MovieCard";
import MovieDetailsModal from "./components/MovieDetailsModal";
import Pagination from "./components/Pagination";
import ApiKeyModal from "./components/ApiKeyModal";
import { 
  fetchPopularMovies, 
  fetchSearchMovies, 
  getStoredApiKey 
} from "./services/movieService";

export default function App() {
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<"browse" | "favorites">("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Pagination & Movie Data
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // App States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  
  // API settings States
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Debounce search input to avoid hitting limits
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page to 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Load favorites and check API key on mount
  useEffect(() => {
    const storedFavs = localStorage.getItem("movie_favorites");
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch (e) {
        console.error("Failed to parse local favorites:", e);
      }
    }
    setHasApiKey(!!getStoredApiKey());
  }, []);

  // Fetch movies based on tab, page, search and key status
  const loadMovies = async () => {
    if (activeTab === "favorites") return;

    setLoading(true);
    setError(null);
    try {
      let data;
      if (debouncedSearchQuery) {
        data = await fetchSearchMovies(debouncedSearchQuery, currentPage);
      } else {
        data = await fetchPopularMovies(currentPage);
      }
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.total_results || 0);
    } catch (err: any) {
      console.error("Error loading movies:", err);
      setError(
        err.message || 
        "Failed to communicate with TMDB API. Please verify your internet connection or check API Key settings."
      );
      setMovies([]);
      setTotalPages(1);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [currentPage, debouncedSearchQuery, hasApiKey, activeTab]);

  // Manage Favorites Toggling
  const handleToggleFavorite = (movie: Movie) => {
    const isFav = favorites.some((fav) => fav.id === movie.id);
    let updated: Movie[];
    if (isFav) {
      updated = favorites.filter((fav) => fav.id !== movie.id);
    } else {
      updated = [...favorites, movie];
    }
    setFavorites(updated);
    localStorage.setItem("movie_favorites", JSON.stringify(updated));
  };

  // Manage API key callback
  const handleKeySaved = () => {
    setHasApiKey(!!getStoredApiKey());
    setCurrentPage(1);
  };

  // Filter favorites lists client-side for ultra-fast performance
  const displayedFavorites = favorites.filter((movie) => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase().trim();
    return (
      movie.title.toLowerCase().includes(lowerQuery) ||
      movie.overview.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div className="min-h-screen bg-cinema-black flex flex-col font-sans text-zinc-100">
      {/* Immersive Background Blur Decorators */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cinema-red/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cinema-red/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />

      {/* Header Panel */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSettings={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
        favoriteCount={favorites.length}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 md:px-8">
        
        {/* Cinematic Welcome Banner */}
        {activeTab === "browse" && !debouncedSearchQuery && (
          <div className="relative rounded-3xl overflow-hidden glass-panel mb-8 p-6 md:p-10 border border-white/10 shadow-xl">
            <div className="absolute top-0 right-0 p-8 text-cinema-red/10 pointer-events-none hidden md:block">
              <Clapperboard className="w-48 h-48" />
            </div>
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cinema-red/10 text-cinema-red border border-cinema-red/15 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Movies
              </span>
              <h1 className="text-3xl md:text-5xl font-serif italic font-extrabold tracking-tight text-white mb-3">
                Discover Cinematic Masterpieces
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Explore the highest rated blockbusters, query millions of titles, and store your curated watchlist locally. Connect your TMDB API Key at the top right to enable live updates!
              </p>
            </div>
          </div>
        )}

        {/* Info Banner when browsing in Mock Mode */}
        {activeTab === "browse" && !hasApiKey && !debouncedSearchQuery && (
          <div className="mb-8 p-3 px-4 rounded-xl bg-cinema-gray-900 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs md:text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cinema-red animate-pulse shrink-0" />
              <span>Browsing in offline-ready <strong className="text-white">Mock Mode</strong>. Seamlessly switch to the complete live database anytime.</span>
            </div>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="text-cinema-red hover:text-cinema-red-hover font-semibold hover:underline cursor-pointer transition shrink-0 text-left"
            >
              Configure Live API Key
            </button>
          </div>
        )}

        {/* Content Section */}
        {activeTab === "browse" ? (
          <div>
            {/* Results Title Info */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                {debouncedSearchQuery ? (
                  <span>Search Results for <span className="text-cinema-red">"{debouncedSearchQuery}"</span></span>
                ) : (
                  <span>Popular Releases</span>
                )}
              </h2>
              {totalResults > 0 && (
                <span className="text-xs font-mono text-zinc-500 bg-[#0a0a0a] border border-white/5 px-2.5 py-1 rounded-lg">
                  {totalResults.toLocaleString()} Movies
                </span>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-5 rounded-2xl bg-cinema-red/5 border border-cinema-red/15 text-cinema-red flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-cinema-red shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Connection or Key Error</h4>
                    <p className="text-sm text-zinc-400">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition shrink-0"
                >
                  Check Settings
                </button>
              </div>
            )}

            {/* Grid Loader */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCw className="w-10 h-10 text-cinema-red animate-spin" />
                <p className="text-zinc-400 text-sm font-medium">Scanning the celestial archives...</p>
              </div>
            ) : movies.length > 0 ? (
              <div>
                {/* Movies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isFavorite={favorites.some((fav) => fav.id === movie.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={setSelectedMovie}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            ) : (
              /* Search Empty State */
              !loading && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
                  <div className="p-4 rounded-full bg-zinc-900 text-zinc-500 mb-5">
                    <SearchX className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No movies found</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    We couldn't find any matches for "{searchQuery}". Try refining spelling, using broader terms, or clearing filters.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 bg-cinema-red text-white font-bold rounded-xl text-sm hover:bg-cinema-red-hover transition"
                  >
                    Clear Search
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          /* Favorites Tab View */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 fill-cinema-red text-cinema-red" />
                <span>My Saved Watchlist</span>
              </h2>
              <span className="text-xs font-mono text-zinc-500 bg-[#0a0a0a] border border-white/5 px-2.5 py-1 rounded-lg">
                {displayedFavorites.length} Movies
              </span>
            </div>

            {displayedFavorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedFavorites.map((movie) => (
                  <MovieCard
                    key={`fav-${movie.id}`}
                    movie={movie}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={setSelectedMovie}
                  />
                ))}
              </div>
            ) : (
              /* Favorites Empty State */
              <div className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto">
                <div className="p-4 rounded-full bg-zinc-900 text-zinc-500 mb-5">
                  {searchQuery ? (
                    <SearchX className="w-10 h-10" />
                  ) : (
                    <HeartOff className="w-10 h-10 text-zinc-600" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {searchQuery ? "No matches in Favorites" : "Your Watchlist is empty"}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  {searchQuery 
                    ? `No favorites matched your search filter "${searchQuery}".`
                    : "Curate your own perfect movie marathon! Go back to Browse, explore popular releases, and tap the heart icon to save them here."
                  }
                </p>
                <button
                  onClick={() => {
                    if (searchQuery) {
                      setSearchQuery("");
                    } else {
                      setActiveTab("browse");
                    }
                  }}
                  className="px-4.5 py-2 bg-cinema-gray-900 hover:bg-white/5 text-white font-semibold rounded-xl border border-white/10 text-sm transition"
                >
                  {searchQuery ? "Clear Watchlist Search" : "Start Browsing Movies"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="py-6 border-t border-white/10 text-center text-xs text-zinc-600 mt-auto bg-cinema-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CINEPHILE. Powered by TMDB API. Curated locally with ❤️</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 transition cursor-pointer" onClick={() => setIsApiKeyModalOpen(true)}>API Settings</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-850" />
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition">TMDB Website</a>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <MovieDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isFavorite={selectedMovie ? favorites.some((fav) => fav.id === selectedMovie.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={handleKeySaved}
      />
    </div>
  );
}
