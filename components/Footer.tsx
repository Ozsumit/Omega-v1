"use client";
import React, { useState, useEffect } from "react";

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
  const [recommendedAnime, setRecommendedAnime] = useState<AnimeData[]>([]);
  const [randomAnime, setRandomAnime] = useState<AnimeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [live, setLive] = useState<boolean>(true); // For live indicator

  // Shuffle array function
  const shuffleArray = (array: AnimeData[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setLoading(true);
        const [seasonalRes, trendingRes, recommendedRes] = await Promise.all([
          fetch("https://api.jikan.moe/v4/seasons/now?limit=3"),
          fetch("https://api.jikan.moe/v4/top/anime?limit=3"),
          fetch("https://api.jikan.moe/v4/anime?genres=1&limit=10"), // Fetch a larger list for shuffling
        ]);

        if (!seasonalRes.ok || !trendingRes.ok || !recommendedRes.ok) {
          throw new Error("Failed to fetch anime data.");
        }

        const seasonalData = await seasonalRes.json();
        const trendingData = await trendingRes.json();
        const recommendedData = await recommendedRes.json();

        setSeasonalAnime(seasonalData.data || []);
        setTrendingAnime(trendingData.data || []);
        setRecommendedAnime(shuffleArray(recommendedData.data).slice(0, 3)); // Shuffle and pick 3
        setError(null); // Reset error on success
      } catch (err) {
        setError(
          "Unable to fetch anime data at the moment. Please try again later."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  const fetchRandomAnime = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.jikan.moe/v4/random/anime");
      const data = await response.json();
      if (data.data) {
        setRandomAnime(data.data);
        setError(null);
      }
    } catch (err) {
      setError("Unable to fetch random anime.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonLoader = () => (
    <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-lg animate-pulse">
      <div className="w-16 h-20 bg-zinc-800 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-zinc-800 rounded"></div>
        <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
      </div>
    </div>
  );

  const AnimeCard = ({
    anime,
    className,
  }: {
    anime: AnimeData;
    className?: string;
  }) => (
    <a
      key={anime.mal_id}
      href={anime.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-4 bg-zinc-900 p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 ${className}`}
    >
      <div
        className="w-16 h-24 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url(${anime.images?.jpg?.image_url})`,
        }}
      ></div>
      <div className="flex-1">
        <h4 className="text-white text-lg font-semibold group-hover:text-green-400 transition-colors">
          {anime.title_english || anime.title}
        </h4>
        <p className="text-yellow-400 text-xs">★ {anime.score}</p>
      </div>
    </a>
  );

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800 py-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Seasonal Anime Section */}
          <div className="md:col-span-2 relative">
            <h3 className="font-semibold text-xl text-white mb-6">
              Currently Airing Anime
            </h3>
            <div className="space-y-6">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => <SkeletonLoader key={index} />)
                : seasonalAnime.length > 0
                ? seasonalAnime.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))
                : error && <p className="text-sm text-zinc-500">{error}</p>}
            </div>
          </div>

          {/* Trending Anime Section */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-xl text-white mb-6">
              Trending Anime
            </h3>
            <div className="space-y-6">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => <SkeletonLoader key={index} />)
                : trendingAnime.length > 0
                ? trendingAnime.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))
                : error && <p className="text-sm text-zinc-500">{error}</p>}
            </div>
          </div>
        </div>

        {/* Random Anime Selector */}
        <div className="mt-12 text-center">
          <button
            onClick={fetchRandomAnime}
            className="px-6 py-3 bg-transparent text-white border border-white rounded-full hover:bg-white hover:text-zinc-950 transition duration-300 transform hover:scale-105"
          >
            Random Anime Selector
          </button>
          {randomAnime && (
            <div className="mt-6">
              <h3 className="font-semibold text-xl text-white mb-4">
                Random Anime
              </h3>
              <AnimeCard anime={randomAnime} />
            </div>
          )}
        </div>

        {/* Live Indicator */}
        <div className="absolute top-4 right-4 text-white bg-green-500 py-1 px-3 rounded-full text-sm">
          {live ? "Live" : "Offline"}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-zinc-800 pt-8 mt-12 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} AnimeHub. All rights reserved.
          </p>
          <p className="text-sm text-zinc-500">
            Built with ❤️ for anime fans • Powered by Jikan API
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
