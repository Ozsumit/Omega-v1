"use client";
import { Suspense } from 'react'
import { Search } from '@/components/search'
import { MiniAnimeCard } from '@/components/mini-anime-card2'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

async function getSearchResults(query: string, page: number = 1) {
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`)
  if (!res.ok) {
    throw new Error('Failed to fetch search results')
  }
  return res.json()
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string; page?: string }
}) {
  const query = searchParams.q
  const currentPage = parseInt(searchParams.page || '1', 10)

  let results = []
  let totalPages = 1
  if (query) {
    try {
      const data = await getSearchResults(query, currentPage)
      results = data.data || []
      totalPages = data.pagination?.last_visible_page || 1
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Anime Search</h1>
      <div className="max-w-2xl mx-auto mb-12">
        <Search />
      </div>
      <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
        {query && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Results for "{query}"</h2>
            {results.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.map((anime: any) => (
                    <MiniAnimeCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>
                <div className="mt-8 flex justify-center items-center space-x-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1)
                      window.location.href = `/search?q=${encodeURIComponent(query)}&page=${newPage}`
                    }}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      const newPage = Math.min(totalPages, currentPage + 1)
                      window.location.href = `/search?q=${encodeURIComponent(query)}&page=${newPage}`
                    }}
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground">No results found for "{query}"</p>
            )}
          </div>
        )}
      </Suspense>
    </div>
  )
}

