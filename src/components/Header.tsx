/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Film, Search, Heart, Key, X, Settings2 } from "lucide-react";

interface HeaderProps {
  activeTab: "browse" | "favorites";
  setActiveTab: (tab: "browse" | "favorites") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
  favoriteCount: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  hasApiKey,
  favoriteCount
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => {
              setActiveTab("browse");
              setSearchQuery("");
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-cinema-red/10 text-cinema-red group-hover:scale-105 transition-transform duration-300">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-serif italic font-extrabold tracking-tighter text-cinema-red">
                CINEPHILE
              </span>
              <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">The Cinematic Vault</p>
            </div>
          </div>

          {/* Quick settings trigger for small screens */}
          <button 
            onClick={onOpenSettings}
            className="md:hidden p-2 rounded-xl bg-zinc-950 text-zinc-400 hover:text-white border border-white/5 transition"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md w-full md:mx-6">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={activeTab === "favorites" ? "Search inside your favorites..." : "Search for movies, actors, directors..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-cinema-red/40 focus:border-cinema-red/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation & API Key Panel */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setActiveTab("browse");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                activeTab === "browse"
                  ? "bg-white/10 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => {
                setActiveTab("favorites");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 relative ${
                activeTab === "favorites"
                  ? "bg-white/10 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Heart className={`w-4 h-4 ${activeTab === "favorites" ? "fill-cinema-red text-cinema-red" : ""}`} />
              Favorites
              {favoriteCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cinema-red text-white animate-pulse">
                  {favoriteCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop API Key Button */}
          <button
            onClick={onOpenSettings}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-850 border border-white/10 text-zinc-300 hover:text-white transition-all text-sm font-medium"
          >
            <Key className={`w-4 h-4 ${hasApiKey ? "text-emerald-400" : "text-cinema-red"}`} />
            <span>API Key</span>
            {hasApiKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-cinema-red" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
