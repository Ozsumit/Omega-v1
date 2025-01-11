// "use client"

// import { useState, useEffect } from 'react'
// import { MiniAnimeCard } from './mini-anime-card'
// import { Button } from './ui/button'
// import { Loader2 } from 'lucide-react'

// async function getTrendingAnime() {
//   const res = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=10')
//   if (!res.ok) {
//     throw new Error('Failed to fetch trending anime')
//   }
//   return res.json()
// }

// export function TrendingAnime() {
//   const [trendingAnime, setTrendingAnime] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchTrendingAnime = async () => {
//       try {
//         const data = await getTrendingAnime()
//         setTrendingAnime(data.data || [])
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchTrendingAnime()
//   }, [])

//   if (isLoading) {
//     return (
//       <div className="text-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//         <p className="mt-4 text-muted-foreground">Loading trending anime...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-500">Error: {error}</p>
//         <Button className="mt-4" onClick={() => window.location.reload()}>
//           Try Again
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="py-8">
//       <h2 className="text-2xl font-bold mb-6 text-center">Trending Anime</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//         {trendingAnime.map((anime: any) => (
//           <MiniAnimeCard key={anime.mal_id} anime={anime} />
//         ))}
//       </div>
//     </div>
//   )
// }

