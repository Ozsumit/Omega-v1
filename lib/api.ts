const API_BASE_URL = 'https://api-anime-info.vercel.app/anime/gogoanime'

export async function searchAnime(query: string) {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error('Failed to fetch search results')
  return response.json()
}

export async function getTopAiring() {
  const response = await fetch(`${API_BASE_URL}/top-airing`)
  if (!response.ok) throw new Error('Failed to fetch top airing anime')
  return response.json()
}

export async function getRecentEpisodes() {
  const response = await fetch(`${API_BASE_URL}/recent-episodes`)
  if (!response.ok) throw new Error('Failed to fetch recent episodes')
  return response.json()
}

export async function getAnimeInfo(id: string) {
  const response = await fetch(`${API_BASE_URL}/info/${id}`)
  if (!response.ok) throw new Error('Failed to fetch anime info')
  return response.json()
}

export async function getEpisodeServers(episodeId: string) {
  const response = await fetch(`${API_BASE_URL}/servers/${episodeId}`)
  if (!response.ok) throw new Error('Failed to fetch episode servers')
  return response.json()
}