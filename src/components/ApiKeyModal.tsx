/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Key, ShieldCheck, HelpCircle, RefreshCw } from "lucide-react";
import { getStoredApiKey, setStoredApiKey } from "../services/movieService";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [currentKey, setCurrentKey] = useState("");

  useEffect(() => {
    const key = getStoredApiKey();
    setApiKey(key);
    setCurrentKey(key);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setCurrentKey(apiKey);
    onKeySaved();
    onClose();
  };

  const handleClear = () => {
    setStoredApiKey("");
    setApiKey("");
    setCurrentKey("");
    onKeySaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl glass-panel-heavy p-6 shadow-2xl transition-all border border-zinc-800"
        id="api-key-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cinema-red/10 text-cinema-red">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">TMDB API Key</h3>
              <p className="text-xs text-zinc-400">Manage data integration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition border border-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mb-6 p-3 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Current Source:</span>
            {currentKey ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live TMDB API
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cinema-red/15 text-cinema-red">
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                Interactive Mock
              </span>
            )}
          </div>
        </div>

        {/* Help Info */}
        <div className="mb-6 p-3.5 rounded-xl bg-cinema-red/5 border border-cinema-red/10 text-xs text-zinc-300">
          <div className="flex gap-2.5">
            <HelpCircle className="w-4 h-4 text-cinema-red shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">How to get a free API Key:</p>
              <ol className="list-decimal pl-4 space-y-0.5 text-zinc-400">
                <li>Create an account at <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-cinema-red hover:underline font-medium">themoviedb.org</a></li>
                <li>Go to Account Settings &gt; API</li>
                <li>Request an API Key (Developer request)</li>
                <li>Copy the API Key (v3 auth) and paste it here!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="apiKeyInput" className="block text-xs font-medium text-zinc-300 mb-2">
              TMDB API Key (v3)
            </label>
            <input
              id="apiKeyInput"
              type="password"
              placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cinema-red/40 focus:border-cinema-red/50 transition-all text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            {currentKey && (
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2.5 rounded-xl border border-cinema-red/25 text-cinema-red hover:bg-cinema-red/10 font-medium transition text-sm"
              >
                Clear Key
              </button>
            )}
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className={`flex-1 py-2.5 rounded-xl bg-cinema-red text-white font-semibold hover:bg-cinema-red-hover transition text-sm ${
                !apiKey.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
