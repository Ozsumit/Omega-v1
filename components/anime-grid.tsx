'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, Tv } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

interface AnimeBase {
  mal_id: number
  title: string
  score: number | null
  members: number
  images: {
    jpg: {
      image_url: string
    }
  }
  type: string
  episodes: number | null
  season: string | null
  year: number | null
}

interface ScheduleAnime extends AnimeBase {
  broadcast: {
    day: string
    time: string
  }
}

type AnimeGridProps = {
  type: 'trending' | 'popular' | 'recent' | 'schedule'
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export function AnimeGrid({ type }: AnimeGridProps) {
  const [animes, setAnimes] = useState<AnimeBase[]>([])
  const [topAiring, setTopAiring] = useState<AnimeBase[]>([])
  const [scheduleData, setScheduleData] = useState<Record<string, ScheduleAnime[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDay] = useState<string>(DAYS_OF_WEEK[new Date().getDay()])

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true)
      setError(null)
      try {
        let url: string
        let data: any

        // Fetch top airing anime for the carousel
        const topAiringResponse = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=10')
        const topAiringData = await topAiringResponse.json()
        setTopAiring(topAiringData.data || [])

        switch (type) {
          case 'trending':
            url = 'https://api.jikan.moe/v4/top/anime?filter=airing'
            break
          case 'popular':
            url = 'https://api.jikan.moe/v4/top/anime?filter=bypopularity'
            break
          case 'recent':
            url = 'https://api.jikan.moe/v4/seasons/now'
            break
          case 'schedule':
            url = 'https://api.jikan.moe/v4/schedules'
            break
          default:
            throw new Error('Invalid anime type')
        }

        const response = await fetch(url)
        data = await response.json()

        if (type === 'schedule') {
          const scheduleByDay: Record<string, ScheduleAnime[]> = {}
          DAYS_OF_WEEK.forEach(day => {
            scheduleByDay[day] = (data.data || []).filter((anime: ScheduleAnime) => 
              anime.broadcast.day?.toLowerCase() === day
            )
          })
          setScheduleData(scheduleByDay)
        } else {
          setAnimes(data.data || [])
        }
      } catch (err) {
        setError('Failed to fetch animes')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnimes()
  }, [type])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error loading anime: {error}</div>
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const renderAnimeCard = (anime: AnimeBase) => (
    <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl h-[300px]">
      <div className="relative h-full">
        <Image
          src={anime.images.jpg.image_url}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="text-lg font-bold leading-tight mb-2">{anime.title}</h3>
        <div className="flex items-center space-x-2 text-sm">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{anime.score ? anime.score.toFixed(1) : 'N/A'}</span>
          <span className="text-gray-300">({anime.members.toLocaleString()} members)</span>
        </div>
        <div className="flex items-center space-x-2 text-sm mt-2">
          <Tv className="w-4 h-4" />
          <span>
            {anime.type === 'TV' ? (
              anime.episodes ? `${anime.episodes} episodes` : 'Ongoing'
            ) : anime.type === 'Movie' ? (
              'Movie'
            ) : (
              `${anime.type}${anime.episodes ? ` (${anime.episodes} eps)` : ''}`
            )}
          </span>
        </div>
        {anime.season && anime.year && (
          <div className="text-sm mt-1">
            {`${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}`}
          </div>
        )}
      </div>
    </div>
  )

  const renderCarousel = (animeList: AnimeBase[] | undefined) => {
    if (!animeList || animeList.length === 0) {
      return <div className="text-center py-8 text-gray-500">No top airing anime found.</div>
    }

    return (
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-screen-xl mx-auto mb-8"
      >
        <CarouselContent>
          {animeList.map((anime) => (
            <CarouselItem key={anime.mal_id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1">
                <Link href={`/anime/${anime.mal_id}`}>
                  {renderAnimeCard(anime)}
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  }

  const renderGrid = (animeList: AnimeBase[] | undefined) => {
    if (!animeList || animeList.length === 0) {
      return <div className="text-center py-8 text-gray-500">No anime found.</div>
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {animeList.map((anime) => (
          <motion.div key={anime.mal_id} variants={fadeInUp}>
            <Link href={`/anime/${anime.mal_id}`}>
              {renderAnimeCard(anime)}
            </Link>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'schedule') {
    return (
      <div className="space-y-8">
        {renderCarousel(topAiring)}
        <Tabs defaultValue={currentDay} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
            {DAYS_OF_WEEK.map((day) => (
              <TabsTrigger key={day} value={day} className="capitalize">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {DAYS_OF_WEEK.map((day) => (
            <TabsContent key={day} value={day}>
              {scheduleData[day]?.length > 0 ? (
                renderGrid(scheduleData[day])
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No anime scheduled for this day.
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {renderCarousel(topAiring)}
      {renderGrid(animes)}
    </div>
  )
}

