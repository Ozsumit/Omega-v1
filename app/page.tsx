"use client";

import React, { useState } from "react";
import { AnimeGrid } from "@/components/AnimeGrid";
import { FeaturedAnime } from "@/components/FeaturedAnime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import HeroAnimeCarousel from "@/components/top-airing-carousel";
import { WelcomeModal, WelcomeModalTrigger } from "@/components/welcome";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.main
      className="space-y-8 container mx-auto px-4 py-8 bg-black text-white"
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.div variants={fadeInUp}>
        <HeroAnimeCarousel />
        {/* <WelcomeModalTrigger onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Open Welcome Guide
        </WelcomeModalTrigger> */}
        <FeaturedAnime />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
            <TabsTrigger value="trending">Trending Anime</TabsTrigger>
            <TabsTrigger value="popular">Popular This Season</TabsTrigger>
            <TabsTrigger value="recent">Recent Episodes</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            <AnimeGrid type="trending" />
          </TabsContent>

          <TabsContent value="popular">
            <AnimeGrid type="popular" />
          </TabsContent>

          <TabsContent value="recent">
            <AnimeGrid type="recent" />
          </TabsContent>

          <TabsContent value="schedule">
            <AnimeGrid type="schedule" />
          </TabsContent>
        </Tabs>
      </motion.div>
      {isModalOpen && <WelcomeModal onClose={() => setIsModalOpen(false)} />}
    </motion.main>
  );
}

