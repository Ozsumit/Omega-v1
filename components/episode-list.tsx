"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Episode {
  id: string;
  number: number;
  title: string;
}

interface EpisodeListProps {
  animeId: string;
}

export function EpisodeList({ animeId }: EpisodeListProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 24;

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`https://api-anime-info.vercel.app/anime/gogoanime/info/${animeId}`);
        const data = await response.json();
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [animeId]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px]" />
        ))}
      </div>
    );
  }

  const pageCount = Math.ceil(episodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const currentEpisodes = episodes.slice(startIndex, startIndex + episodesPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Episodes</h2>
        <Select
          value={currentPage.toString()}
          onValueChange={(value) => setCurrentPage(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: pageCount }).map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                Page {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentEpisodes.map((episode) => (
          <Link key={episode.id} href={`/watch/${episode.id}`}>
            <Card className="flex h-[100px] cursor-pointer items-center justify-center p-4 text-center transition-colors hover:bg-muted">
              <p>Episode {episode.number}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}