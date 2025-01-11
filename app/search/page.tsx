"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { searchAnime } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setIsLoading(true)
        try {
          const data = await searchAnime(query)
          setResults(data.results)
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchResults()
  }, [query])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.map((anime) => (
            <Link key={anime.id} href={`/anime/${anime.id}`}>
              <Card className="overflow-hidden hover:scale-105 transition-transform">
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={anime.image || "/placeholder.svg?height=300&width=200"}
                      alt={anime.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium line-clamp-2">{anime.title}</h3>
                    <p className="text-xs text-muted-foreground">{anime.releaseDate}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

