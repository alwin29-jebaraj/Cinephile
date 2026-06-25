/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Calendar, Star, Heart, TrendingUp, ThumbsUp, Film } from "lucide-react";
import { Movie, GENRES } from "../types";
import { getMovieImageUrl } from "../services/movieService";

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export default function MovieDetailsModal({
  movie,
  onClose,
  isFavorite,
  onToggleFavorite
}: MovieDetailsModalProps) {
  if (!movie) return null;

  // Find all genre names
  const genreNames = movie.genre_ids
    ? movie.genre_ids
        .map((id) => GENRES.find((g) => g.id === id)?.name)
        .filter(Boolean)
    : [];

  const releaseDateFormatted = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Release Date Unavailable";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-cinema-black border border-white/10 shadow-2xl transition-all"
        id="movie-details-modal"
      >
        {/* Backdrop Banner Image */}
        <div className="relative h-60 md:h-80 w-full overflow-hidden">
          <img
            src={getMovieImageUrl(movie.backdrop_path, "backdrop")}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-50"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80";
            }}
          />
          {/* Vignette bottom-fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/45 to-transparent" />
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/10 text-zinc-300 hover:text-white hover:bg-black/80 transition z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="relative px-6 pb-8 -mt-24 md:-mt-32 flex flex-col md:flex-row gap-6">
          {/* Floating Poster */}
          <div className="w-36 md:w-48 shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-xl">
            <img
              src={getMovieImageUrl(movie.poster_path)}
              alt={movie.title}
              referrerPolicy="no-referrer"
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          {/* Main Info */}
          <div className="flex-1 flex flex-col pt-0 md:pt-16">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif italic font-extrabold tracking-tight text-white mb-2">
                  {movie.title}
                </h2>
                {movie.original_title && movie.original_title !== movie.title && (
                  <p className="text-xs font-mono text-zinc-500 mb-2">
                    Original Title: {movie.original_title}
                  </p>
                )}
              </div>

              {/* Action Favorite Button */}
              <button
                onClick={() => onToggleFavorite(movie)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-300 hover:scale-102 active:scale-98 shrink-0 ${
                  isFavorite
                    ? "bg-cinema-red/15 border-cinema-red/30 text-cinema-red hover:bg-cinema-red/25"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                <span>{isFavorite ? "Favorited" : "Add to Favorites"}</span>
              </button>
            </div>

            {/* Quick Genre Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {genreNames.map((name) => (
                <span
                  key={name}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0a0a0a] text-zinc-300 border border-white/5"
                >
                  {name}
                </span>
              ))}
            </div>

            {/* Movie Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-6 p-4 rounded-2xl bg-[#0a0a0a] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500 shrink-0">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Rating</p>
                  <p className="text-sm font-semibold text-white">
                    {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Votes</p>
                  <p className="text-sm font-semibold text-white">
                    {movie.vote_count ? movie.vote_count.toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="p-2.5 rounded-xl bg-cinema-red/10 text-cinema-red shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Release Date</p>
                  <p className="text-sm font-semibold text-white whitespace-nowrap">
                    {releaseDateFormatted}
                  </p>
                </div>
              </div>
            </div>

            {/* Overview Plot */}
            <div className="mt-6">
              <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-500 mb-2">
                Synopsis
              </h4>
              <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                {movie.overview || "No overview available for this movie."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
