import { Play, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import moviePlaceHolder from "@/assets/movie-placeholder.jpg";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingMovies } from "../api/get-upcoming-movies";

export const UpcomingMoviesCarousel = () => {
  const { data, isLoading, isError } = useUpcomingMovies({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const originalMovies = data?.data.upcomingMovies || [];

  const movies =
    originalMovies.length > 3
      ? [...originalMovies, ...originalMovies, ...originalMovies]
      : originalMovies;

  useEffect(() => {
    const container = carouselRef.current;
    if (!container || originalMovies.length === 0) return;

    const checkOverflow = () => {
      setShowArrows(container.scrollWidth > container.clientWidth);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    const firstItem = container.firstElementChild as HTMLElement;
    if (firstItem) {
      const itemWidth = firstItem.offsetWidth;
      const gap = 24;
      const singleSetWidth = originalMovies.length * (itemWidth + gap);

      container.style.scrollBehavior = "auto";
      container.scrollLeft = singleSetWidth;
    }

    return () => window.removeEventListener("resize", checkOverflow);
  }, [originalMovies.length]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container || originalMovies.length === 0) return;

    const handleScrollEnd = () => {
      const firstItem = container.firstElementChild as HTMLElement;
      if (!firstItem) return;

      const singleSetWidth =
        originalMovies.length * (firstItem.offsetWidth + 24);

      if (container.scrollLeft >= singleSetWidth * 2) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft -= singleSetWidth;
      } else if (container.scrollLeft <= 0) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft += singleSetWidth;
      }
    };

    container.addEventListener("scrollend", handleScrollEnd);
    return () => container.removeEventListener("scrollend", handleScrollEnd);
  }, [originalMovies.length]);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current || originalMovies.length === 0) return;
    const container = carouselRef.current;
    const firstItem = container.firstElementChild as HTMLElement;
    if (!firstItem) return;

    const itemWidth = firstItem.offsetWidth;
    const gap = 24;
    const scrollStep = itemWidth + gap;
    const singleSetWidth = originalMovies.length * scrollStep;

    const visibleItems = Math.max(
      1,
      Math.floor(container.clientWidth / scrollStep),
    );
    const scrollAmount = scrollStep * visibleItems;

    if (
      direction === "right" &&
      container.scrollLeft + scrollAmount >= singleSetWidth * 2
    ) {
      container.style.scrollBehavior = "auto";
      container.scrollLeft -= singleSetWidth;
    } else if (
      direction === "left" &&
      container.scrollLeft - scrollAmount <= 0
    ) {
      container.style.scrollBehavior = "auto";
      container.scrollLeft += singleSetWidth;
    }

    requestAnimationFrame(() => {
      container.style.scrollBehavior = "smooth";
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    });
  };

  if (isLoading) {
    const skeletonCards = Array.from({ length: 5 });

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 md:h-10 w-48 md:w-64" />
        </div>

        <div className="relative group/carousel">
          <div className="flex gap-6 overflow-hidden pb-8 pt-2">
            {skeletonCards.map((_, index) => (
              <Skeleton
                key={`skeleton-${index}`}
                className="w-64 h-96 md:w-72 md:h-112 shrink-0 rounded-xl"
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (isError || movies.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Upcoming Movies
          </h2>
        </div>
        <div className="text-center text-muted-foreground py-12">
          <p>There are no upcoming movies at the moment.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Upcoming Movies
        </h2>
      </div>

      <div className="relative group/carousel">
        {showArrows && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-[45%] -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-primary/50 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:cinema-glow hover:scale-110 opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, index) => {
            const hasSchedules =
              movie.movieSchedules && movie.movieSchedules.length > 0;
            const hasTrailer = !!movie.trailerUrl;

            return (
              <div
                key={`${movie.id}-${index}`}
                className="relative group w-64 h-96 md:w-72 md:h-112 shrink-0 snap-start rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 hover:border-primary hover:cinema-glow"
              >
                <img
                  src={movie.posterUrl || moviePlaceHolder}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center z-10">
                  <h3 className="text-lg font-bold text-foreground mb-4 line-clamp-2">
                    {movie.title}
                  </h3>

                  {movie.synopsis && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-5">
                      {movie.synopsis}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 w-full mt-auto mb-4">
                    {hasSchedules && (
                      <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-primary text-primary-foreground font-semibold transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 cinema-glow">
                        <Ticket className="w-4 h-4" />
                        Buy Ticket
                      </button>
                    )}

                    {hasTrailer && (
                      <a href={movie.trailerUrl} target="_blank">
                        <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-transparent border-2 border-primary text-primary font-semibold transition-all hover:bg-primary/10 hover:scale-105 active:scale-95">
                          <Play className="w-4 h-4 fill-current" />
                          View Trailer
                        </button>
                      </a>
                    )}

                    {!hasSchedules && !hasTrailer && (
                      <p className="text-sm text-muted-foreground italic">
                        Info not available yet
                      </p>
                    )}
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-primary-foreground border border-white/10 z-0 capitalize">
                  {movie.status.replace(/_/g, " ").toLowerCase()}
                </div>
              </div>
            );
          })}
        </div>

        {showArrows && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-[45%] -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-primary/50 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:cinema-glow hover:scale-110 opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </>
  );
};
