"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimeBase {
  mal_id: number;
  title: string;
  title_english: string | null;
  score: number | null;
  synopsis: string;
  trailer: {
    images: {
      maximum_image_url: string;
      large_image_url: string;
    };
  };
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  genres: Array<{ name: string }>;
}

const LoadingSkeleton = () => (
  <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-xl overflow-hidden">
    <div className="animate-pulse bg-neutral-100 dark:bg-neutral-900 w-full h-full" />
  </div>
);

export function HeroAnimeCarousel() {
  const [animes, setAnimes] = React.useState<AnimeBase[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: false,
    },
    [Autoplay({ delay: 8000, stopOnInteraction: true })]
  );

  // Progress calculation
  const [progress, setProgress] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const updateProgress = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setProgress(progress);
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", () => setCurrentIndex(emblaApi.selectedScrollSnap()));
    emblaApi.on("scroll", updateProgress);
    emblaApi.on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      updateProgress();
    });

    return () => {
      emblaApi.off("select", () => {});
      emblaApi.off("scroll", () => {});
      emblaApi.off("reInit", () => {});
    };
  }, [emblaApi, updateProgress]);

  React.useEffect(() => {
    const fetchTopAiring = async () => {
      try {
        const response = await fetch(
          "https://api.jikan.moe/v4/top/anime?filter=airing&limit=5"
        );
        const data = await response.json();
        setAnimes(data.data || []);
      } catch (error) {
        console.error("Failed to fetch top airing anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopAiring();
  }, []);

  const getImageUrl = (anime: AnimeBase) => {
    return (
      anime.trailer?.images?.maximum_image_url ||
      anime.trailer?.images?.large_image_url ||
      anime.images.jpg.large_image_url
    );
  };

  const truncateSynopsis = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="relative w-full z-[50] overflow-hidden rounded-xl">
      <div ref={emblaRef} className="w-full">
        <div className="flex">
          <AnimatePresence mode="wait">
            {animes.map((anime, index) => (
              <motion.div
                key={anime.mal_id}
                className="flex-[0_0_100%] relative w-full aspect-video sm:aspect-[21/9]"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentIndex ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={getImageUrl(anime)}
                  alt={anime.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent" />

                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.3,
                    }}
                  >
                    <div className="container mx-auto px-6 sm:px-8">
                      <div className="max-w-2xl space-y-6">
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight"
                        >
                          {anime.title_english || anime.title}
                        </motion.h1>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="flex flex-wrap gap-2"
                        >
                          {anime.genres?.slice(0, 3).map((genre) => (
                            <span
                              key={genre.name}
                              className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white/90"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="hidden sm:block text-white/70 text-sm sm:text-base max-w-xl"
                        >
                          {truncateSynopsis(anime.synopsis)}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1, delay: 0.7 }}
                        >
                          <Link href={`/anime/${anime.mal_id}`}>
                            <Button className="group bg-white text-black hover:bg-white/90 transition-all duration-500">
                              Watch Now
                              <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-500 group-hover:translate-x-1" />
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Unified Control Interface */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => emblaApi?.scrollPrev()}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/90 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <div className="flex items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className="group relative h-8 flex items-center"
            >
              <div className="w-12 h-[2px] bg-white/20 overflow-hidden">
                {currentIndex === index && (
                  <motion.div
                    className="h-full bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 8, ease: "linear" }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => emblaApi?.scrollNext()}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/90 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default HeroAnimeCarousel;
