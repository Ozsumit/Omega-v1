"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon, Loader2, X } from "lucide-react";
import { MiniAnimeCard } from "./mini-anime-card";
import { useDebounce } from "@/hooks/use-debounce";
import { motion, AnimatePresence } from "framer-motion";

interface AnimeResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  aired: {
    from: string;
  };
  score: number;
  type: string;
}

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback(async () => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
            debouncedQuery
          )}&limit=5`
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        setResults(data.data || []);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !(event.target as Element)?.closest(".search-trigger")
      ) {
        setIsFocused(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="relative w-full z-[9999] max-w-lg mx-auto">
      {/* Mobile search trigger */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="search-trigger md:hidden absolute right-0 top-1/2 -translate-y-1/2"
        onClick={toggleSearch}
      >
        <SearchIcon className="h-5 w-5" />
        <span className="sr-only">Toggle search</span>
      </Button>

      {/* Search form */}
      <AnimatePresence>
        {(!isSearchOpen ? true : isSearchOpen) && (
          <motion.form
            onSubmit={handleSubmit}
            className="relative hidden md:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full pr-20 pl-4 py-2 text-lg rounded-md border-2 border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-14 top-1/2 -translate-y-1/2 hover:bg-none"
                onClick={clearSearch}
              >
                <X className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 text-white -translate-y-1/2 rounded-full bg-transparent hover:bg-transparent"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SearchIcon className="h-5 w-5 bg-none" />
              )}
              <span className="sr-only">Search</span>
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Mobile search form */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.form
            onSubmit={handleSubmit}
            className="md:hidden fixed inset-x-0 top-0 p-4 bg-background border-b"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative max-w-lg mx-auto">
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full pr-20 pl-4 py-2 text-lg rounded-md border-2 border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-14 top-1/2 -translate-y-1/2"
                onClick={() => {
                  clearSearch();
                  setIsSearchOpen(false);
                }}
              >
                <X className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search results */}
      <AnimatePresence>
        {isFocused && (results.length > 0 || isLoading) && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 right-0 z-[9999] mt-2 bg-background border rounded-lg shadow-lg overflow-hidden ${
              isSearchOpen ? "fixed top-[4.5rem] mx-4" : "top-full"
            }`}
          >
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="mt-2">Searching...</p>
              </div>
            ) : (
              results.map((anime, index) => (
                <motion.div
                  key={anime.mal_id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-2"
                >
                  <MiniAnimeCard anime={anime} />
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
