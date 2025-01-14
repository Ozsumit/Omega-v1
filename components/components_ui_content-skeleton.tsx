import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ContentSkeletonProps {
  variant?: "horizontal" | "vertical" | "timeslot"
  className?: string
}

export function ContentSkeleton({ 
  variant = "vertical",
  className 
}: ContentSkeletonProps) {
  // Vertical Card (Anime/Show Card)
  if (variant === "vertical") {
    return (
      <Card className={cn("bg-zinc-900 border-zinc-800 overflow-hidden w-[240px]", className)}>
        <div className="relative">
          <Skeleton className="aspect-[2/3] w-full bg-zinc-800" />
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            <Skeleton className="h-5 w-full bg-zinc-800" />
            <Skeleton className="h-4 w-2/3 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16 bg-zinc-800" />
              <Skeleton className="h-4 w-24 bg-zinc-800" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Skeleton className="h-4 w-24 bg-zinc-800" />
              <Skeleton className="h-4 w-20 bg-zinc-800" />
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Horizontal Card (Show/Episode Card)
  if (variant === "horizontal") {
    return (
      <Card className={cn("bg-zinc-900 border-zinc-800", className)}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Skeleton className="w-[100px] h-[140px] rounded-md bg-zinc-800 shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4 bg-zinc-800" />
              <Skeleton className="h-4 w-1/2 bg-zinc-800" />
              <Skeleton className="h-4 w-1/3 bg-zinc-800" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
                <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Timeslot Layout
  return (
    <div className={cn("min-h-[200px] bg-zinc-950 p-4", className)}>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full bg-zinc-800" />
            <Skeleton className="h-7 w-20 bg-zinc-800" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full bg-zinc-800" />
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Skeleton className="w-[100px] h-[140px] rounded-md bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4 bg-zinc-800" />
                <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                <Skeleton className="h-4 w-1/3 bg-zinc-800" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
                  <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

