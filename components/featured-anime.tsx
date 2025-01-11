"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { getTopAiring } from "@/lib/api";

interface FeaturedAnime {
  id: string;
  title: string;
  image: string;
  description: string;
}

export function FeaturedAnime() {
  const [featuredAnime, setFeaturedAnime] = useState<FeaturedAnime[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchFeaturedAnime = async () => {
      try {
        const data = await getTopAiring();
        setFeaturedAnime(data.results.slice(0, 3).map((anime: any) => ({
          id: anime.id,
          title: anime.title,
          image: anime.image,
          description: anime.description || "No description available.",
        })));
      } catch (error) {
        console.error("Error fetching featured anime:", error);
      }
    };

    fetchFeaturedAnime();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredAnime.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredAnime.length) % featuredAnime.length)
  }

  if (featuredAnime.length === 0) return null

  const currentAnime = featuredAnime[currentIndex]

  return (
    <div className="relative h-[400px] overflow-hidden rounded-lg">
      <Image
        src={currentAnime.image}
        alt={currentAnime.title}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">{currentAnime.title}</h2>
        <p className="mb-4">{currentAnime.description}</p>
        <Link href={`/anime/${currentAnime.id}`}>
          <Button variant="secondary">Watch Now</Button>
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-4 -translate-y-1/2 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-4 -translate-y-1/2 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}

