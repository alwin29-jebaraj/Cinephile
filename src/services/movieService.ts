/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie, TMDBResponse } from "../types";
import { MOCK_MOVIES } from "../data/mockMovies";

const API_KEY_STORAGE_KEY = "tmdb_api_key";
const BASE_URL = "https://api.themoviedb.org/3";

export function getStoredApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || ((import.meta as any).env?.VITE_TMDB_API_KEY as string) || "";
}

export function setStoredApiKey(key: string): void {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

export async function fetchPopularMovies(page: number = 1): Promise<TMDBResponse> {
  const apiKey = getStoredApiKey();
  if (apiKey) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${apiKey}&page=${page}&language=en-US`
      );
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Live TMDB fetch failed, falling back to mock:", error);
      throw error; // Re-throw so the UI can notify the user of key invalidity or network error
    }
  }

  // Fallback / Mock mode
  const limit = 8;
  const startIndex = (page - 1) * limit;
  const paginatedResults = MOCK_MOVIES.slice(startIndex, startIndex + limit);
  
  return {
    page: page,
    results: paginatedResults,
    total_pages: Math.ceil(MOCK_MOVIES.length / limit),
    total_results: MOCK_MOVIES.length
  };
}

export async function fetchSearchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
  if (!query.trim()) {
    return fetchPopularMovies(page);
  }

  const apiKey = getStoredApiKey();
  if (apiKey) {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}&page=${page}&language=en-US`
      );
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Live TMDB search failed, falling back to mock:", error);
      throw error;
    }
  }

  // Fallback / Mock search
  const lowerQuery = query.toLowerCase().trim();
  const filtered = MOCK_MOVIES.filter(
    (movie) =>
      movie.title.toLowerCase().includes(lowerQuery) ||
      movie.overview.toLowerCase().includes(lowerQuery)
  );

  const limit = 8;
  const startIndex = (page - 1) * limit;
  const paginatedResults = filtered.slice(startIndex, startIndex + limit);

  return {
    page: page,
    results: paginatedResults,
    total_pages: Math.max(1, Math.ceil(filtered.length / limit)),
    total_results: filtered.length
  };
}

export function getMovieImageUrl(path: string | null, size: "poster" | "backdrop" = "poster"): string {
  if (!path) {
    if (size === "backdrop") {
      return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=60";
    }
    return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60";
  }
  
  if (path.startsWith("/")) {
    if (size === "backdrop") {
      return `https://image.tmdb.org/t/p/w1280${path}`;
    }
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
  
  return path;
}
