// app/page.tsx
import { AnimeGrid } from "@/components/anime-grid";
import { HeroSection } from "@/components/hero-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <HeroSection />

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="trending">Trending Anime</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="recent">Recent Episodes</TabsTrigger>
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
      </Tabs>
    </main>
  );
}
