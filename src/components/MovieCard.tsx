/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, Heart } from "lucide-react";
import { Movie, GENRES } from "../types";
import { getMovieImageUrl } from "../services/movieService";

interface MovieCardProps {
  key?: React.Key;
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onSelect: (movie: Movie) => void;
}

export default function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
  onSelect
}: MovieCardProps) {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  // Get the first two genre names for quick display tags
  const genreNames = movie.genre_ids
    ? movie.genre_ids
        .map((id) => GENRES.find((g) => g.id === id)?.name)
        .filter(Boolean)
        .slice(0, 2)
    : [];

  // Color code rating badge
  const getRatingColor = (rating: number) => {
    if (rating >= 8.0) return "bg-emerald-500/90 text-white";
    if (rating >= 6.5) return "bg-yellow-500/90 text-zinc-950";
    return "bg-orange-500/90 text-white";
  };

  return (
    <div 
      onClick={() => onSelect(movie)}
      className="group relative flex flex-col rounded-2xl bg-cinema-gray-900 border border-white/5 overflow-hidden cursor-pointer hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] transition-all duration-300 transform hover:-translate-y-1.5"
      id={`movie-card-${movie.id}`}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
        <img
          src={getMovieImageUrl(movie.poster_path)}
          alt={movie.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80";
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold shadow-md ${getRatingColor(movie.vote_average)}`}>
            <Star className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
          </div>
        </div>

        {/* Favorite Button (floating) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md border shadow-md transition-all duration-300 hover:scale-110 active:scale-95 ${
            isFavorite
              ? "bg-cinema-red/15 border-cinema-red/30 text-cinema-red hover:bg-cinema-red/25"
              : "bg-black/60 border-white/10 text-white/80 hover:bg-black/80 hover:text-white"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Elegant Bottom Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info Panel */}
      <div className="flex flex-col flex-grow p-4 bg-[#0a0a0a]">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-mono text-zinc-500 font-medium">
            {releaseYear}
          </span>
          <div className="flex gap-1.5">
            {genreNames.map((name) => (
              <span
                key={name}
                className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-zinc-900 text-zinc-400 border border-white/5"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <h3 className="font-semibold text-white group-hover:text-cinema-red text-sm line-clamp-1 transition-colors duration-200">
          {movie.title}
        </h3>
        
        <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
          {movie.overview || "No overview available."}
        </p>
      </div>
    </div>
  );
}
