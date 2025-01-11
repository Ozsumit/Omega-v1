import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface AnimeResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  aired: {
    from: string;
  };
  score: number;
  type: string;
}

interface MiniAnimeCardProps {
  anime: AnimeResult;
}

export function MiniAnimeCard({ anime }: MiniAnimeCardProps) {
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-w-2 aspect-h-3">
            <Image
              src={
                anime.images.jpg.image_url ||
                "/placeholder.svg?height=300&width=200"
              }
              alt={anime.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
            <div className="absolute top-2 left-2"></div>
            {anime.score && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold rounded-full p-1 text-xs flex items-center">
                <Star className="w-3 h-3 mr-0.5" />
                {anime.score.toFixed(1)}
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold line-clamp-2 mb-1" title={anime.title}>
              {anime.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {anime.aired.from
                ? new Date(anime.aired.from).getFullYear()
                : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
