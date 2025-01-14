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
  Clock,
  Calendar,
  Users,
  AlertCircle,
  Filter,
  Loader,
  PlayCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnimeBase {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_synonyms: string[];
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
    timezone: string;
  };
}

interface TimeSlot {
  time: string;
  animes: ScheduleAnime[];
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
  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
    <Skeleton className="w-20 h-28 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

const LoadingTimeSlot = () => (
  <Card className="bg-zinc-900 border-zinc-800">
    <CardContent className="pt-6">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
        <Skeleton className="h-6 w-32 bg-zinc-800" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </CardContent>
  </Card>
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

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
};

const groupAnimesByTime = (animes: ScheduleAnime[]): TimeSlot[] => {
  const timeSlots: { [key: string]: ScheduleAnime[] } = {};

  animes.forEach((anime) => {
    if (anime.broadcast?.time) {
      const time = anime.broadcast.time;
      if (!timeSlots[time]) {
        timeSlots[time] = [];
      }
      timeSlots[time].push(anime);
    }
  });

  return Object.entries(timeSlots)
    .map(([time, animes]) => ({
      time,
      animes: animes.sort((a, b) => (b.score || 0) - (a.score || 0)),
    }))
    .sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(":").map(Number);
      const [bHours, bMinutes] = b.time.split(":").map(Number);
      return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
    });
};

const ScheduleTimeSlot: React.FC<{ slot: TimeSlot }> = ({ slot }) => (
  <Card className="mb-8">
    <CardContent className="pt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
          <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />
        </div>
        <h3 className="text-xl font-semibold">{formatTime(slot.time)}</h3>
        <Badge variant="secondary" className="ml-auto">
          {slot.animes.length} {slot.animes.length === 1 ? "Show" : "Shows"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slot.animes.map((anime) => (
          <Link
            key={anime.mal_id}
            href={`/anime/${anime.mal_id}`}
            className="group relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="relative w-20 h-28 flex-shrink-0">
                <Image
                  src={anime.images.jpg.image_url}
                  alt={getPreferredTitle(anime)}
                  fill
                  className="object-cover rounded-lg"
                  sizes="80px"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 rounded-lg transition-colors">
                  <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <h4 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {getPreferredTitle(anime)}
                  </h4>
                  {anime.title !== getPreferredTitle(anime) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">
                      {anime.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {anime.type} • {anime.episodes || "?"} Episodes
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  {anime.score ? (
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                      <Star
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                      />
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                        {anime.score.toFixed(1)}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{(anime.members / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </CardContent>
  </Card>
);

const getPreferredTitle = (anime: AnimeBase): string => {
  return anime.title_english || anime.title_synonyms[0] || anime.title;
};

const AnimeCard: React.FC<{ anime: AnimeBase }> = ({ anime }) => (
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
        alt={getPreferredTitle(anime)}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    <div className="absolute inset-x-0 bottom-0 p-4 text-white transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
      <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">
        {getPreferredTitle(anime)}
      </h3>
      {anime.title !== getPreferredTitle(anime) && (
        <p className="text-sm text-gray-300 mb-2 line-clamp-1">{anime.title}</p>
      )}

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

export function AnimeGrid({ type }: AnimeGridProps) {
  const [animes, setAnimes] = useState<AnimeBase[]>([]);
  const [scheduleData, setScheduleData] = useState<
    Record<string, ScheduleAnime[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("score");
  const [retryCount, setRetryCount] = useState(0);
  const [currentDay, setCurrentDay] = useState<string>(
    DAYS_OF_WEEK[new Date().getDay() - 1 >= 0 ? new Date().getDay() - 1 : 6]
  );

  const fetchAnimes = useCallback(
    async (day: string) => {
      setLoading(true);
      setError(null);

      const maxRetries = 5;
      let attempts = 0;

      const fetchWithRetry = async (url: string) => {
        while (attempts < maxRetries) {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
          } catch (err) {
            attempts++;
            console.error(`Attempt ${attempts} failed:`, err);
            await new Promise((resolve) =>
              setTimeout(resolve, Math.min(attempts * 1000, 5000))
            );
          }
        }
        throw new Error("Max retries reached");
      };

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
            url = `https://api.jikan.moe/v4/schedules/${day}?limit=20`;
            break;
          default:
            throw new Error("Invalid anime type");
        }

        const data = await fetchWithRetry(url);

        if (type === "schedule") {
          setScheduleData((prev) => ({
            ...prev,
            [day]: (data.data || []).sort(
              (a: ScheduleAnime, b: ScheduleAnime) =>
                (getSortableValue(b, sortBy) || 0) -
                (getSortableValue(a, sortBy) || 0)
            ),
          }));
        } else {
          setAnimes(data.data || []);
        }
      } catch (err) {
        setError("Failed to fetch anime data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [type, sortBy]
  );

  useEffect(() => {
    fetchAnimes(currentDay);
  }, [fetchAnimes, currentDay]);

  const handleRetry = () => {
    setRetryCount((count) => count + 1);
    fetchAnimes(currentDay);
  };

  const getSortableValue = (
    anime: AnimeBase | ScheduleAnime,
    key: string
  ): number | null => {
    return (anime as any)[key] ?? null;
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
              <AnimeCard anime={anime} />
            </Link>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderScheduleContent = (daySchedule: ScheduleAnime[] = []) => {
    if (loading) {
      return (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <LoadingTimeSlot key={i} />
          ))}
        </div>
      );
    }

    if (!daySchedule.length) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">
            No anime scheduled for this day.
          </p>
        </motion.div>
      );
    }

    const timeSlots = groupAnimesByTime(daySchedule);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {timeSlots.map((slot) => (
          <ScheduleTimeSlot key={slot.time} slot={slot} />
        ))}
      </motion.div>
    );
  };

  const handleTabChange = (day: string) => {
    setCurrentDay(day);
    if (!scheduleData[day]) {
      fetchAnimes(day);
    }
  };

  if (error) {
    return <ErrorAlert message={error} onRetry={handleRetry} />;
  }

  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
            <Skeleton className="h-6 w-32 bg-zinc-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "schedule") {
    return (
      <div className="space-y-8">
        {renderHeader()}
        <Tabs defaultValue={currentDay} className="w-full">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pb-4">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              {DAYS_OF_WEEK.map((day) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="capitalize px-6 py-2.5 text-sm font-medium whitespace-nowrap rounded-lg"
                  onClick={() => {
                    if (!scheduleData[day]) {
                      fetchAnimes(day);
                    }
                    setCurrentDay(day);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{day}</span>
                    {loading && currentDay === day && (
                      <Loader className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {DAYS_OF_WEEK.map((day) => (
                <TabsContent key={day} value={day} className="mt-6">
                  {renderScheduleContent(scheduleData[day])}
                </TabsContent>
              ))}
            </AnimatePresence>
          </div>
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
