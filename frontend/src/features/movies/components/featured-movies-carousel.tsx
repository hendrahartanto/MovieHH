import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import { useFeaturedMovies } from "@/features/movies/api/get-featured-movies";
import { formatImageUrl } from "@/helper/image-helper";
import { TrailerModal } from "./trailer-modal";
import { Movie } from "../types";
import { Button } from "@/components/ui/button";

export const FeaturedMoviesCarousel = () => {
  const { data, isLoading } = useFeaturedMovies({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectetMovie, setSelectedMovie] = useState<Movie>();

  const movies = data?.data?.featuredMovies || [];

  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsAutoPlaying(false);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[650px] bg-linear-to-b from-background to-card animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return null;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-[650px] overflow-hidden bg-background group">
      <div className="absolute inset-0">
        <img
          src={formatImageUrl(currentMovie.bannerUrl || "")}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="content-wrapper relative h-full flex items-center">
        <div className="max-w-2xl space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-primary">
              Featured Movie
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight drop-shadow-lg">
            {currentMovie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            {currentMovie.duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {formatDuration(currentMovie.duration)}
                </span>
              </div>
            )}
            {currentMovie.genres && currentMovie.genres.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {currentMovie.genres.map((g) => g.name).join(", ")}
                </span>
              </div>
            )}
          </div>

          {currentMovie.synopsis && (
            <p className="text-lg text-muted-foreground line-clamp-3 max-w-xl">
              {currentMovie.synopsis}
            </p>
          )}

          {(currentMovie.director || currentMovie.writer) && (
            <div className="space-y-1 text-sm">
              {currentMovie.director && (
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Director:</span>{" "}
                  {currentMovie.director}
                </p>
              )}
              {currentMovie.writer && (
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Writer:</span>{" "}
                  {currentMovie.writer}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="glow" className="px-8 py-6 text-base rounded-lg shadow-lg">
              Book Tickets
            </Button>
            {currentMovie.trailerUrl && (
              <button
                onClick={() => {
                  setSelectedMovie(currentMovie);
                  setShowTrailer(true);
                }}
                className="px-8 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-lg transition-colors border border-border"
              >
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {movies.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous movie"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next movie"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {movies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-12 bg-primary"
                  : "w-6 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to movie ${index + 1}`}
            />
          ))}
        </div>
      )}

      <TrailerModal
        isOpen={showTrailer}
        movie={selectetMovie}
        onClose={() => setShowTrailer(false)}
      />
    </div>
  );
};
