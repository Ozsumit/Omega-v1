'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface FeaturedAnime {
  id: number
  title: string
  description: string
  coverImage: string
}

export function FeaturedAnime() {
  const [featured, setFeatured] = useState<FeaturedAnime | null>(null)

  useEffect(() => {
    const fetchFeaturedAnime = async () => {
      try {
        // This is a mock API call. Replace with your actual API endpoint.
        const response = await fetch('https://api.example.com/featured-anime')
        const data = await response.json()
        setFeatured(data)
      } catch (error) {
        console.error('Failed to fetch featured anime:', error)
      }
    }

    fetchFeaturedAnime()
  }, [])

  if (!featured) {
    return null
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-[21/9] md:aspect-[21/7]">
          <Image
            src={featured.coverImage}
            alt={featured.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <motion.div 
            className="absolute bottom-0 left-0 p-4 md:p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-2">{featured.title}</h2>
            <p className="text-sm md:text-base mb-4 max-w-xl">{featured.description}</p>
            <Link href={`/anime/${featured.id}`}>
              <Button variant="secondary">Watch Now</Button>
            </Link>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

