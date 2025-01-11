"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnimeDetailsProps {
  anime: {
    title: string;
    synopsis: string;
    genres: string[];
    status: string;
    rating: string;
    score: number;
    images: {
      jpg: {
        large_image_url: string;
      };
    };
  };
}

export function AnimeDetails({ anime }: AnimeDetailsProps) {
  return (
    <Card className="overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row">
        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-lg md:w-[300px]">
          <Image
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{anime.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{anime.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="font-medium">{anime.rating}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="font-medium">{anime.score}</p>
            </div>
          </div>

          <ScrollArea className="h-[200px]">
            <p className="text-muted-foreground">{anime.synopsis}</p>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}