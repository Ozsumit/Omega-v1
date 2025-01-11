"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
      <Image
        src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80"
        alt="Hero background"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          Welcome to Omegaω
        </h1>
        <p className="max-w-2xl text-lg text-gray-200">
          Stream your favorite anime in HD quality. New episodes added daily.
        </p>
        <Button size="lg" className="mt-4">
          <PlayCircle className="mr-2 h-5 w-5" />
          Start Watching
        </Button>
      </div>
    </div>
  );
}
