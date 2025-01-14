"use client";
import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, ExternalLink, Dice1 } from "lucide-react";
import Link from "next/link";

interface AnimeData {
  mal_id: number;
  title: string;
  title_english?: string;
  score: number;
  images: {
    jpg?: {
      image_url?: string;
    };
  };
  url: string;
}

export function Footer() {
  const [seasonalAnime, setSeasonalAnime] = useState<AnimeData[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<AnimeData[]>([]);
  const [randomAnime, setRandomAnime] = useState<AnimeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [live, setLive] = useState<boolean>(false);
  const [randomLoading, setRandomLoading] = useState<boolean>(false);

  const fetchWithRetry = useCallback(async (url: string) => {
    const maxRetries = 5;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
      } catch (err) {
        attempts++;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(attempts * 1000, 5000))
        );
      }
    }
    throw new Error("Max retries reached");
  }, []);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setLoading(true);
        const [seasonalData, trendingData] = await Promise.all([
          fetchWithRetry("https://api.jikan.moe/v4/seasons/now?limit=3"),
          fetchWithRetry("https://api.jikan.moe/v4/top/anime?limit=3"),
        ]);

        setSeasonalAnime(seasonalData.data || []);
        setTrendingAnime(trendingData.data || []);
        setError(null);
        setLive(true);
      } catch (err) {
        setError("Unable to fetch anime data.");
        setLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, [fetchWithRetry]);

  const fetchRandomAnime = async () => {
    setRandomLoading(true);
    try {
      const data = await fetchWithRetry(
        "https://api.jikan.moe/v4/random/anime"
      );
      if (data.data) {
        setRandomAnime(data.data);
        setError(null);
      }
    } catch (err) {
      setError("Unable to fetch random anime.");
    } finally {
      setRandomLoading(false);
    }
  };

  const AnimeCard = ({ anime }: { anime: AnimeData }) => (
    <div className="group border border-zinc-900 hover:border-white/10 bg-black/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-300">
      <div className="flex gap-6">
        <div className="relative w-24 h-36 rounded-md overflow-hidden bg-zinc-900">
          {anime.images?.jpg?.image_url && (
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(${anime.images.jpg.image_url})`,
              }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white/90 text-lg font-medium leading-tight group-hover:text-white">
            {anime.title_english || anime.title}
          </h4>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-white/50 text-sm font-medium">
              Score: {anime.score}
            </span>
            <Link
              href={`/anime/${anime.mal_id}`}
              className="text-sm text-white/50 hover:text-green-400 transition-colors flex items-center gap-2 px-4 py-2 rounded-md hover:bg-white/5"
            >
              View Details <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const SkeletonLoader = () => (
    <div className="border border-zinc-900 bg-black/20 rounded-lg p-4">
      <div className="flex gap-6">
        <div className="w-24 h-36 bg-zinc-900/50 rounded-md animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-zinc-900/50 rounded animate-pulse" />
          <div className="h-4 bg-zinc-900/50 rounded w-2/3 animate-pulse" />
          <div className="h-10 bg-zinc-900/50 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <footer className="bg-black border-t border-zinc-900 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {error && (
          <div className="mb-8 px-4 py-3 rounded-lg border border-red-900/50 bg-red-500/5 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section>
            <h3 className="text-white/90 text-xl font-medium mb-6 flex items-center gap-3">
              Currently Airing
              <span className="text-sm text-white/40 font-normal">
                This Season
              </span>
            </h3>
            <div className="space-y-4">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => <SkeletonLoader key={index} />)
                : seasonalAnime.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
            </div>
          </section>

          <section>
            <h3 className="text-white/90 text-xl font-medium mb-6 flex items-center gap-3">
              Trending Now
              <span className="text-sm text-green-400 font-normal">Live</span>
            </h3>
            <div className="space-y-4">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => <SkeletonLoader key={index} />)
                : trendingAnime.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
            </div>
          </section>
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={fetchRandomAnime}
            disabled={randomLoading}
            className="px-6 py-3 text-sm text-white/90 border border-white/10 rounded-lg hover:bg-white/5 hover:border-white/20 disabled:opacity-50 transition-colors"
          >
            {randomLoading ? (
              <RefreshCw className="w-5 h-5 inline-block animate-spin mr-2" />
            ) : (
              <Dice1 className="w-5 h-5 inline-block mr-2" />
            )}
            Random Discovery
          </button>

          {randomAnime && (
            <div className="mt-6 max-w-2xl mx-auto">
              <AnimeCard anime={randomAnime} />
            </div>
          )}
        </div>

        <div className="fixed top-6 right-6 flex items-center gap-2 bg-black/90 border border-zinc-900 text-sm px-4 py-2 rounded-lg">
          <span
            className={`w-2 h-2 rounded-full ${
              live ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-white/60">{live ? "Live" : "Offline"}</span>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-900/50 text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} AnimeHub • Powered by Jikan API
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
