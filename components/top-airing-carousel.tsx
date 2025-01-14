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
  <div className="relative w-full min-h-[400px] sm:min-h-[450px] md:min-h-0 md:aspect-[21/9] rounded-lg sm:rounded-xl overflow-hidden">
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

  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const updateProgress = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
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
          "https://api.jikan.moe/v4/top/anime?filter=airing&limit=10"
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

  const truncateSynopsis = (text: string, maxLength: number = 160) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength).trim() + "...";
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="relative w-full overflow-hidden rounded-lg sm:rounded-xl bg-black">
      <div ref={emblaRef} className="w-full">
        <div className="flex">
          <AnimatePresence mode="wait">
            {animes.map((anime, index) => (
              <motion.div
                key={anime.mal_id}
                className="flex-[0_0_100%] relative w-full min-h-[400px] sm:min-h-[450px] md:min-h-0 md:aspect-[21/9]"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentIndex ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={getImageUrl(anime)}
                    alt={anime.title}
                    fill
                    priority={index === 0}
                    className="object-cover object-center"
                    sizes="100vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent sm:bg-gradient-to-r sm:from-black/90 sm:via-black/70 sm:to-transparent" />
                </div>

                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 flex items-end sm:items-center pb-20 sm:pb-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="flex items-center gap-3"
                        >
                          {anime.score && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-white text-sm font-medium">
                                {anime.score}
                              </span>
                            </div>
                          )}
                          <div className="h-6 flex items-center">
                            <div className="w-[1px] h-4 bg-white/20" />
                          </div>
                          <span className="text-white/60 text-sm">
                            {anime.genres?.[0]?.name}
                          </span>
                        </motion.div>

                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight line-clamp-2"
                        >
                          {truncateTitle(anime.title_english || anime.title)}
                        </motion.h1>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="flex flex-wrap gap-2"
                        >
                          {anime.genres?.slice(1, 4).map((genre) => (
                            <span
                              key={genre.name}
                              className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="hidden sm:block text-white/70 text-base sm:text-sm leading-relaxed line-clamp-3 max-w-lg"
                        >
                          {truncateSynopsis(anime.synopsis)}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="pt-3 sm:pt-4"
                        >
                          <Link href={`/anime/${anime.mal_id}`}>
                            <Button className="group bg-white hover:bg-white/90 text-black transition-all duration-300 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm font-medium">
                              Watch Now
                              <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 ml-2 transition-transform duration-300 group-hover:translate-x-0.5" />
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

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => emblaApi?.scrollPrev()}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/90 hover:bg-black/40 transition-colors border border-white/10"
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
              <div className="w-12 h-[2px] bg-white/20 overflow-hidden rounded-full">
                {currentIndex === index && (
                  <motion.div
                    className="h-full bg-white rounded-full"
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => emblaApi?.scrollNext()}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/90 hover:bg-black/40 transition-colors border border-white/10"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default HeroAnimeCarousel;
