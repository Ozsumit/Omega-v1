"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { VideoPlayer } from "@/components/video-player";
import { EpisodeNavigation } from "@/components/episode-navigation";
import { ServerList } from "@/components/server-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function WatchPage() {
  const { id } = useParams();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await fetch(`https://api-anime-info.vercel.app/anime/gogoanime/servers/${id}`);
        const data = await response.json();
        setSources(data);
      } catch (error) {
        console.error("Error fetching sources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [id]);

  if (loading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="space-y-6">
      <VideoPlayer sources={sources} />
      <ServerList sources={sources} />
      <EpisodeNavigation episodeId={id} />
    </div>
  );
}