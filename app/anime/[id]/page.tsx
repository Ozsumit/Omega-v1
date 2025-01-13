"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnimeDetails {
  mal_id: number;
  title: string;
  synopsis: string;
  score: number;
  rank: number;
  popularity: number;
  status: string;
  episodes: number;
  duration: string;
  rating: string;
  season: string;
  year: number;
  studios: Array<{ name: string }>;
  genres: Array<{ name: string }>;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    embed_url: string;
  };
}

interface Episode {
  id: string;
  number: number;
  title: string;
}

interface Server {
  name: string;
  url: string;
}

export default function AnimePage() {
  const { id } = useParams();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState<
    number | null
  >(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [currentServer, setCurrentServer] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [episodeLoading, setEpisodeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("info");
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 30;

  const titleToSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const paginatedEpisodes = episodes.slice(
    (currentPage - 1) * episodesPerPage,
    currentPage * episodesPerPage
  );

  useEffect(() => {
    const fetchAnimeData = async () => {
      setLoading(true);
      setError(null);

      try {
        const malResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        if (!malResponse.ok) {
          throw new Error(
            `Failed to fetch anime data: ${malResponse.statusText}`
          );
        }
        const malData = await malResponse.json();
        setAnime(malData.data);

        const animeSlug = titleToSlug(malData.data.title);
        const consumetResponse = await fetch(
          `https://omega-api-five.vercel.app/anime/gogoanime/info/${animeSlug}`
        );
        if (!consumetResponse.ok) {
          throw new Error(
            `Failed to fetch episodes: ${consumetResponse.statusText}`
          );
        }

        const consumetData = await consumetResponse.json();
        if (Array.isArray(consumetData.episodes)) {
          setEpisodes(consumetData.episodes);
        } else {
          console.warn("No episodes found or invalid format");
          setEpisodes([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch anime details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimeData();
    }
  }, [id]);

  const fetchServers = async (episodeId: string, episodeNumber: number) => {
    setEpisodeLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://omega-api-five.vercel.app/anime/gogoanime/servers/${episodeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch servers");
      }
      const data = await response.json();
      setServers(data);
      setSelectedEpisode(episodeId);
      setSelectedEpisodeNumber(episodeNumber);
      setCurrentTab("watch");

      if (data.length > 0) {
        setCurrentServer(data[0].url);
      }
    } catch (error) {
      console.error("Error fetching servers:", error);
      setError("Failed to fetch servers. Please try again.");
    } finally {
      setEpisodeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[300px] flex-shrink-0">
            <Skeleton className="w-full aspect-[3/4]" />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Image and basic info */}
        <div className="w-full lg:w-[300px] flex-shrink-0">
          <Card>
            <CardContent className="p-2">
              <div className="relative aspect-[3/4]">
                <Image
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  fill
                  className="object-cover rounded"
                  sizes="(min-width: 1024px) 300px, 100vw"
                  priority
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 space-y-4">
            <div className="flex gap-2 flex-wrap">
              {anime.genres.map((genre) => (
                <Badge key={genre.name} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-secondary rounded text-center">
                <div className="text-lg font-bold">
                  ⭐ {anime.score || "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              <div className="p-3 bg-secondary rounded text-center">
                <div className="text-lg font-bold">#{anime.rank || "N/A"}</div>
                <div className="text-xs text-muted-foreground">Rank</div>
              </div>
              <div className="p-3 bg-secondary rounded text-center">
                <div className="text-lg font-bold">
                  {anime.episodes || "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">Episodes</div>
              </div>
              <div className="p-3 bg-secondary rounded text-center">
                <div className="text-lg font-bold">{anime.status}</div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Details and episodes */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">{anime.title}</h1>

          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
              {selectedEpisode && (
                <TabsTrigger value="watch">Watch</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {anime.synopsis}
                </p>
              </div>

              {anime.trailer?.embed_url && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Trailer</h2>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={anime.trailer.embed_url}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="episodes">
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {paginatedEpisodes.map((episode) => (
                    <button
                      key={episode.id}
                      onClick={() => fetchServers(episode.id, episode.number)}
                      className={`p-4 rounded-lg transition-colors ${
                        selectedEpisodeNumber === episode.number
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      <div className="font-semibold">
                        Episode {episode.number}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {episode.title}
                      </div>
                    </button>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {selectedEpisode && (
              <TabsContent value="watch" className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">
                        Episode {selectedEpisodeNumber}
                      </h2>
                    </div>

                    {episodeLoading && (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                    )}

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {!episodeLoading && !error && currentServer && (
                      <div className="space-y-4">
                        <Card className="aspect-video relative overflow-hidden rounded-lg">
                          <iframe
                            src={currentServer}
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                          />
                        </Card>
                        <ScrollArea className="w-full whitespace-nowrap">
                          <div className="flex gap-2 p-1">
                            {servers.map((server) => (
                              <Button
                                key={server.name}
                                variant={
                                  currentServer === server.url
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setCurrentServer(server.url)}
                                className="flex-shrink-0"
                              >
                                {server.name}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>

                  <div className="lg:w-[300px] flex-shrink-0">
                    <h2 className="text-xl font-semibold mb-4">Episodes</h2>
                    <ScrollArea className="h-[600px] rounded-md border p-4">
                      <div className="grid grid-cols-1 gap-2">
                        {episodes.map((episode) => (
                          <button
                            key={episode.id}
                            onClick={() =>
                              fetchServers(episode.id, episode.number)
                            }
                            className={`p-3 rounded-lg transition-colors text-left ${
                              selectedEpisodeNumber === episode.number
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                          >
                            <div className="font-semibold">
                              Episode {episode.number}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {episode.title}
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
