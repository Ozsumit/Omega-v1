"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Define interfaces for different API responses
interface JikanAnime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface GogoAnime {
  id: string;
  title: string;
  image: string;
}

interface ScheduleAnime extends JikanAnime {
  broadcast: {
    day: string;
    time: string;
  };
}

// Union type for all possible anime types
type AnimeItem = JikanAnime | GogoAnime | ScheduleAnime;

interface AnimeGridProps {
  type: "trending" | "popular" | "recent" | "schedule";
}

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function AnimeGrid({ type }: AnimeGridProps) {
  const [animes, setAnimes] = useState<AnimeItem[]>([]);
  const [scheduleData, setScheduleData] = useState<
    Record<string, ScheduleAnime[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentDay = DAYS_OF_WEEK[new Date().getDay() - 1] || "monday";

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      setError(null);

      try {
        if (type === "schedule") {
          const responses = await Promise.all(
            DAYS_OF_WEEK.map((day) =>
              fetch(`https://api.jikan.moe/v4/schedules/${day}`).then((res) => {
                if (!res.ok)
                  throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
              })
            )
          );

          const scheduleByDay = DAYS_OF_WEEK.reduce((acc, day, index) => {
            acc[day] = responses[index].data || [];
            return acc;
          }, {} as Record<string, ScheduleAnime[]>);

          setScheduleData(scheduleByDay);
        } else {
          let endpoint = "";
          switch (type) {
            case "trending":
              endpoint = "https://api.jikan.moe/v4/top/anime";
              break;
            case "popular":
              endpoint = "https://api.jikan.moe/v4/seasons/now";
              break;
            case "recent":
              endpoint =
                "https://api-anime-info.vercel.app/anime/gogoanime/recent-episodes";
              break;
          }

          const response = await fetch(endpoint);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setAnimes(data.data || data.results);
        }
      } catch (error) {
        console.error("Error fetching animes:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch anime"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [type]);

  // Type guard to check if anime is from Jikan API
  const isJikanAnime = (anime: AnimeItem): anime is JikanAnime => {
    return "mal_id" in anime;
  };

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error loading anime: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-[300px]" />
        ))}
      </div>
    );
  }

  if (type === "schedule") {
    return (
      <Tabs defaultValue={currentDay} className="w-full">
        <TabsList className="w-full justify-between mb-4">
          {DAYS_OF_WEEK.map((day) => (
            <TabsTrigger key={day} value={day} className="capitalize">
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {DAYS_OF_WEEK.map((day) => (
          <TabsContent key={day} value={day}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {scheduleData[day]?.map((anime) => (
                <Link key={anime.mal_id} href={`/anime/${anime.mal_id}`}>
                  <Card className="overflow-hidden hover:scale-105 transition-transform">
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={anime.images.jpg.image_url}
                          alt={anime.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        />
                      </div>
                      <div className="p-2">
                        <h3 className="text-sm font-medium line-clamp-2">
                          {anime.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {anime.broadcast.time || "Time TBA"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {scheduleData[day]?.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No anime scheduled for this day.
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {animes.map((anime) => (
        <Link
          key={isJikanAnime(anime) ? anime.mal_id : anime.id}
          href={`/anime/${isJikanAnime(anime) ? anime.mal_id : anime.id}`}
        >
          <Card className="overflow-hidden hover:scale-105 transition-transform">
            <CardContent className="p-0">
              <div className="relative aspect-[2/3]">
                <Image
                  src={
                    isJikanAnime(anime)
                      ? anime.images.jpg.image_url
                      : anime.image
                  }
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-medium line-clamp-2">
                  {anime.title}
                </h3>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
