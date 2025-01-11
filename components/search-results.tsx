"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { searchAnime } from "@/lib/api"
import { Card } from "@/components/ui/card"

interface SearchResultsProps {
  query: string
  onSelect: () => void
}

export function SearchResults({ query, onSelect }: SearchResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const data = await searchAnime(query)
        setResults(data.results.slice(0, 5))
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setLoading(false)
      }
    }

    if (query.length >= 3) {
      fetchResults()
    }
  }, [query])

  if (loading) {
    return (
      <Card className="absolute top-full w-full mt-2 p-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </Card>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <Card className="absolute top-full w-full mt-2 divide-y divide-border">
      {results.map((anime) => (
        <Link
          key={anime.id}
          href={`/anime/${anime.id}`}
          className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
          onClick={onSelect}
        >
          <div className="relative w-12 h-16">
            <Image
              src={anime.image}
              alt={anime.title}
              fill
              className="object-cover rounded"
              sizes="48px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{anime.title}</p>
          </div>
        </Link>
      ))}
    </Card>
  )
}