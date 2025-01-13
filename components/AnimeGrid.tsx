"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Tv,
  Calendar,
  Users,
  AlertCircle,
  Filter,
  Loader,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AnimeBase {
  mal_id: number;
  title: string;
  score: number | null;
  members: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
  type: string;
  episodes: number | null;
  season: string | null;
  year: number | null;
}

interface ScheduleAnime extends AnimeBase {
  broadcast: {
    day: string;
    time: string;
  };
}

type AnimeGridProps = {
  type: "trending" | "popular" | "recent" | "schedule";
};

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const SORT_OPTIONS = [
  { value: "score", label: "Rating" },
  { value: "members", label: "Popularity" },
  { value: "title", label: "Title" },
];

const LoadingCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
  >
    <div className="absolute inset-0">
      <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-gray-700" />
    </div>
  </motion.div>
);

const ErrorAlert = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <Alert variant="destructive" className="my-8">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription className="flex items-center justify-between">
      <span>{message}</span>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded-md transition-colors"
      >
        Try Again
      </button>
    </AlertDescription>
  </Alert>
);

export function AnimeGrid({ type }: AnimeGridProps) {
  const [animes, setAnimes] = useState<AnimeBase[]>([]);
  const [scheduleData, setScheduleData] = useState<
    Record<string, ScheduleAnime[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("score");
  const [retryCount, setRetryCount] = useState(0);
  const [currentDay] = useState<string>(
    DAYS_OF_WEEK[new Date().getDay() - 1 >= 0 ? new Date().getDay() - 1 : 6]
  );

  const fetchAnimes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url: string;
      switch (type) {
        case "trending":
          url = "https://api.jikan.moe/v4/top/anime?filter=airing&limit=20";
          break;
        case "popular":
          url =
            "https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=20";
          break;
        case "recent":
          url = "https://api.jikan.moe/v4/seasons/now?limit=20";
          break;
        case "schedule":
          url = "https://api.jikan.moe/v4/schedules";
          break;
        default:
          throw new Error("Invalid anime type");
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (type === "schedule") {
        const scheduleByDay: Record<string, ScheduleAnime[]> = {};
        DAYS_OF_WEEK.forEach((day) => {
          scheduleByDay[day] = (data.data || [])
            .filter(
              (anime: ScheduleAnime) =>
                anime.broadcast?.day?.toLowerCase() === day
            )
            .sort(
              (a: ScheduleAnime, b: ScheduleAnime) =>
                (getSortableValue(b, sortBy) || 0) -
                (getSortableValue(a, sortBy) || 0)
            );
        });
        setScheduleData(scheduleByDay);
      } else {
        setAnimes(data.data || []);
      }
    } catch (err) {
      setError("Failed to fetch anime data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type, sortBy]);

  useEffect(() => {
    const delay = retryCount > 0 ? Math.min(retryCount * 1000, 5000) : 0;
    const timeoutId = setTimeout(fetchAnimes, delay);
    return () => clearTimeout(timeoutId);
  }, [fetchAnimes, retryCount]);

  const handleRetry = () => {
    setRetryCount((count) => count + 1);
  };

  const getSortableValue = (
    anime: AnimeBase | ScheduleAnime,
    key: string
  ): number | null => {
    return (anime as any)[key] ?? null;
  };

  const renderAnimeCard = (anime: AnimeBase) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute inset-0">
        <Image
          src={anime.images.jpg.image_url}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 text-white transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">
          {anime.title}
        </h3>

        <div className="space-y-2 text-sm">
          {anime.score && (
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span>{anime.score.toFixed(1)}</span>
              <span className="text-gray-300">•</span>
              <span>{(anime.members / 1000).toFixed(0)}K members</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Tv className="w-4 h-4" />
            <span>
              {anime.type === "TV"
                ? `${anime.episodes || "?"} episodes`
                : anime.type}
            </span>
          </div>

          {anime.season && anime.year && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                {`${
                  anime.season.charAt(0).toUpperCase() + anime.season.slice(1)
                } ${anime.year}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderGrid = (animeList: AnimeBase[] | undefined) => {
    if (!animeList?.length) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">
            No anime found for this selection.
          </p>
        </motion.div>
      );
    }

    const sortedAnimes = [...animeList].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return (
        (getSortableValue(b, sortBy) || 0) - (getSortableValue(a, sortBy) || 0)
      );
    });

    return (
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {sortedAnimes.map((anime) => (
            <Link key={anime.mal_id} href={`/anime/${anime.mal_id}`}>
              {renderAnimeCard(anime)}
            </Link>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        {type === "trending" && "Trending Anime"}
        {type === "popular" && "Popular Anime"}
        {type === "recent" && "Recent Releases"}
        {type === "schedule" && "Anime Schedule"}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2"
      >
        <Filter className="w-4 h-4" />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>
    </div>
  );

  if (error) {
    return <ErrorAlert message={error} onRetry={handleRetry} />;
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (type === "schedule") {
    return (
      <div className="space-y-8">
        {renderHeader()}
        <Tabs defaultValue={currentDay} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {DAYS_OF_WEEK.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="capitalize px-4 py-2 text-sm font-medium whitespace-nowrap"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          {DAYS_OF_WEEK.map((day) => (
            <TabsContent key={day} value={day}>
              {renderGrid(scheduleData[day])}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {renderHeader()}
      {renderGrid(animes)}
    </div>
  );
}

export default AnimeGrid;
