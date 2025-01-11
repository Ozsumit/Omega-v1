"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface SearchResultsProps {
  results: any[];
  onSelect: () => void;
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="absolute top-full w-full mt-2 z-50 max-h-96 overflow-auto">
      {results.map((anime, index) => (
        <motion.div
          key={anime.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href={`/anime/${anime.id}`}
            className="block hover:bg-muted/50 transition-colors"
            onClick={onSelect}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className="relative w-12 h-16 flex-shrink-0">
                <Image
                  src={anime.image || "/placeholder.svg?height=64&width=48"}
                  alt={anime.title}
                  fill
                  className="object-cover rounded"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{anime.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {anime.releaseDate}
                </p>
              </div>
            </CardContent>
          </Link>
        </motion.div>
      ))}
    </Card>
  );
}
