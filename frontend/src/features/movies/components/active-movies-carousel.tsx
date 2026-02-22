import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useActiveMovies } from "../api/get-active-movies";
import { Skeleton } from "@/components/ui/skeleton";
import { MovieCard } from "./movie-card";

export const ActiveMoviesCarousel = () => {
  const { data, isLoading, isError } = useActiveMovies({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const originalMovies = data?.data.activeMovies || [];

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
                className="w-64 h-96 md:w-72 md:h-112 shrink-0 rounded-xl cinema-border"
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
            Now Showing
          </h2>
        </div>
        <div className="text-center text-muted-foreground py-12">
          <p>No movies are currently showing.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Now Showing
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
          {movies.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))}
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
