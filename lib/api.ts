const API_BASE_URL = "https://api-anime-info.vercel.app/anime/gogoanime";
// const API_BASE_URL = "https://api.example.com"; // Replace with your actual API base URL

export async function getTopAiring() {
  const response = await fetch(`${API_BASE_URL}/top-airing`);
  if (!response.ok) throw new Error("Failed to fetch top airing anime");
  return response.json();
}

export async function getRecentEpisodes() {
  const response = await fetch(`${API_BASE_URL}/recent-episodes`);
  if (!response.ok) throw new Error("Failed to fetch recent episodes");
  return response.json();
}

export async function getFeaturedAnime() {
  const response = await fetch(`${API_BASE_URL}/featured-anime`);
  if (!response.ok) throw new Error("Failed to fetch featured anime");
  return response.json();
}

export async function getWeeklySchedule() {
  const response = await fetch(`${API_BASE_URL}/weekly-schedule`);
  if (!response.ok) throw new Error("Failed to fetch weekly schedule");
  return response.json();
}

export async function getAnimeNews() {
  const response = await fetch(`${API_BASE_URL}/anime-news`);
  if (!response.ok) throw new Error("Failed to fetch anime news");
  return response.json();
}

export async function getAnimeDetails(id: string) {
  const response = await fetch(`${API_BASE_URL}/anime/${id}`);
  if (!response.ok) throw new Error("Failed to fetch anime details");
  return response.json();
}

export async function getAnimeEpisodes(id: string) {
  const response = await fetch(`${API_BASE_URL}/anime/${id}/episodes`);
  if (!response.ok) throw new Error("Failed to fetch anime episodes");
  return response.json();
}
