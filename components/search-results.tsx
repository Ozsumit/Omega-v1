"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useKey } from "react-use";

interface Anime {
  id: string;
  title: string;
  image?: string;
  releaseDate?: string;
}

interface SearchResultsProps {
  results: Anime[];
  onSelect: () => void;
  isLoading?: boolean;
}

export function SearchResults({
  results,
  onSelect,
  isLoading,
}: SearchResultsProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  // Keyboard navigation
  useKey("ArrowDown", (e: KeyboardEvent) => {
    e.preventDefault();
    setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
  });

  useKey("ArrowUp", (e: KeyboardEvent) => {
    e.preventDefault();
    setSelectedIndex((prev) => Math.max(prev - 1, -1));
  });

  useKey("Enter", () => {
    if (selectedIndex >= 0 && results[selectedIndex]) {
      window.location.href = `/anime/${results[selectedIndex].id}`;
      onSelect();
    }
  });

  if (results.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="absolute top-full w-full mt-2 z-50 max-h-96 overflow-auto shadow-lg">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 text-center text-muted-foreground"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse" />
              <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse delay-150" />
              <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse delay-300" />
            </div>
          </motion.div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 text-center text-muted-foreground"
          >
            No results found
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {results.map((anime, index) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/anime/${anime.id}`}
                  className={`block transition-colors relative ${
                    index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  onClick={onSelect}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="relative w-12 h-16 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={
                          anime.image || "/placeholder.svg?height=64&width=48"
                        }
                        alt={anime.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {anime.title}
                      </p>
                      {anime.releaseDate && (
                        <p className="text-xs text-muted-foreground truncate">
                          {anime.releaseDate}
                        </p>
                      )}
                    </div>
                    {index === selectedIndex && (
                      <motion.div
                        layoutId="highlight"
                        className="absolute inset-0 border-2 border-primary rounded pointer-events-none"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </CardContent>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
