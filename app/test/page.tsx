"use client";

import React from "react";
import { AnimeGrid } from "@/components/AnimeGrid";
import { FeaturedAnime } from "@/components/FeaturedAnime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import HeroAnimeCarousel from "@/components/top-airing-carousel";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Home() {
  return (
    <motion.main>
      <iframe
        src="https://omega-api-five.vercel.app/anime/zoro/watch/spy-x-family-17977$episode$89506$both?server=vidcloud"
        className="w-full h-full"
        allowFullScreen
      />
    </motion.main>
  );
}
