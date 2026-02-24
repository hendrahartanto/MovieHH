import { useMovie } from "@/features/movies/api/get-movie";
import { MovieStatus } from "@/lib/api";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { MovieHero } from "@/features/movies/components/movie-hero";
import { MovieInfo } from "@/features/movies/components/movie-info";
import { TrailerModal } from "@/features/movies/components/trailer-modal";
import { MovieDetailSkeleton } from "@/features/movies/components/movie-detail-skeleton";
import { MovieBookingSection } from "@/features/movie-schedules/components/movie-booking-section";

const MoviePage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [showTrailer, setShowTrailer] = useState(false);

  const { data: movieData, isLoading: isMovieLoading } = useMovie({
    movieId: movieId!,
  });

  if (isMovieLoading) return <MovieDetailSkeleton />;

  const movie = movieData?.data?.movie;
  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MovieHero movie={movie} onPlayTrailer={() => setShowTrailer(true)} />

      <div className="content-wrapper -mt-32 relative z-10 pb-20">
        <MovieInfo movie={movie} onPlayTrailer={() => setShowTrailer(true)} />

        {movie.status === MovieStatus.ACTIVE && (
          <MovieBookingSection movieId={movieId!} />
        )}

        {movie.status === MovieStatus.COMING_SOON && (
          <div className="mt-14 rounded-xl cinema-border p-10 text-center bg-card/50">
            <div className="w-14 h-14 rounded-full cinema-gradient flex items-center justify-center mx-auto mb-4 cinema-glow">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold mb-2">Coming Soon</p>
            <p className="text-muted-foreground max-w-sm mx-auto">
              This movie is not yet available for booking. Stay tuned for the
              schedule!
            </p>
          </div>
        )}
      </div>

      <TrailerModal
        isOpen={showTrailer}
        movie={movie}
        onClose={() => setShowTrailer(false)}
      />
    </div>
  );
};

export default MoviePage;
