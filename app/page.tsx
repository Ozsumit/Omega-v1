"use client";
import { AnimeGrid } from "@/components/anime-grid";
import { useEffect } from "react";
import { FeaturedAnime } from "@/components/featured-anime";
import { ToastWithLink } from "@/components/ui/components_toast-with-link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
const showToast = () => {
  toast(
    <ToastWithLink
      title="Use Hianime "
      description="I appriciate the thought but i highly recommend using Hianime for the best anime streaming experience."
      linkText="Go to Hianime"
      linkHref="https:/hianime.to/home"
    />
  );
};

export default function Home() {
  useEffect(() => {
    showToast();
  }, []);
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <FeaturedAnime />

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="trending">Trending Anime</TabsTrigger>
          <TabsTrigger value="popular">This season</TabsTrigger>
          <TabsTrigger value="recent">Recent Episodes</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-6">
          <AnimeGrid type="trending" />
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <AnimeGrid type="popular" />
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <AnimeGrid type="recent" />
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <AnimeGrid type="schedule" />
        </TabsContent>
      </Tabs>
    </main>
  );
}
