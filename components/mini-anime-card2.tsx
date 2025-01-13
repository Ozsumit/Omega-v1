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
interface AnimeResult {
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
  // type: string;
  episodes: number | null;
  season: string | null;
  year: number | null;
  // mal_id: number;
  // title: string;
  // images: {
  //   jpg: {
  //     image_url: string;
  //   };
  // };
  aired: {
    from: string;
  };
  // score: number;
  type: string;
}

interface MiniAnimeCardProps {
  anime: AnimeResult;
}

export function MiniAnimeCard({ anime }: MiniAnimeCardProps) {
  const getPreferredTitle = (anime: AnimeBase): string => {
    return anime.title_english || anime.title_synonyms[0] || anime.title;
  };
  return (
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
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
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
  );
}
