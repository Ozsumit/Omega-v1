import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ThumbsUp } from "lucide-react";

interface ReviewData {
  user: {
    username: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  tags: string[];
  review: string;
  score: number;
  date: string;
  reactions: {
    nice: number;
  };
}

interface AnimeReviewsProps {
  malId: number;
}

export default function AnimeReviews({ malId }: AnimeReviewsProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime/${malId}/reviews`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching reviews"
        );
      } finally {
        setLoading(false);
      }
    };

    if (malId) {
      fetchReviews();
    }
  }, [malId]);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        Failed to load reviews: {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-muted-foreground">
        No reviews available for this anime.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Reviews</h2>
      
      <div className="space-y-4">
        {paginatedReviews.map((review, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.user.images.jpg.image_url} />
                  <AvatarFallback>
                    {review.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{review.user.username}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Score: {review.score}/10
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {review.reactions.nice}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {formatDate(review.date)}
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {review.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm leading-relaxed">
                    {review.review.length > 500
                      ? `${review.review.slice(0, 500)}...`
                      : review.review}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}