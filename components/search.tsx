"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon, Loader2 } from "lucide-react";
import { SearchResults } from "./search-results";

interface AnimeResult {
  id: string;
  title: string;
  // Add other properties as needed
}

export function Search() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = useCallback(async () => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await response.json();
        setResults(data.results?.slice(0, 5) || []);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    handleSearch();
  }, [debouncedQuery, handleSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input
          type="search"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-0 top-0 h-full"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SearchIcon className="h-4 w-4" />
          )}
        </Button>
      </form>
      {results.length > 0 && (
        <SearchResults results={results} onSelect={() => setQuery("")} />
      )}
    </div>
  );
}
