import { Play, Ticket } from "lucide-react";
import moviePlaceHolder from "@/assets/movie-placeholder.jpg";
import { Movie } from "../types";
import { formatImageUrl } from "@/helper/image-helper";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { useState } from "react";
import { TrailerModal } from "./trailer-modal";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const [showTrailer, setShowTrailer] = useState(false);

  const navigate = useNavigate();
  const hasSchedules = movie.movieSchedules && movie.movieSchedules.length > 0;
  const hasTrailer = !!movie.trailerUrl;

  const handleCardClick = () => {
    navigate(paths.movie.getHref(movie.id));
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative group w-64 h-96 md:w-72 md:h-112 shrink-0 snap-start rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 hover:border-primary hover:cinema-glow cursor-pointer"
    >
      <img
        src={
          movie.posterUrl ? formatImageUrl(movie.posterUrl) : moviePlaceHolder
        }
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
            <button
              onClick={handleCardClick}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-primary text-primary-foreground font-semibold transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 cinema-glow"
            >
              <Ticket className="w-4 h-4" />
              Buy Ticket
            </button>
          )}

          {hasTrailer && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTrailer(true);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-transparent border-2 border-primary text-primary font-semibold transition-all hover:bg-primary/10 hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              View Trailer
            </button>
          )}

          {!hasSchedules && !hasTrailer && (
            <p className="text-sm text-muted-foreground italic">
              Info not available yet
            </p>
          )}
        </div>
      </div>

      {movie.status && (
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-primary-foreground border border-white/10 z-0 capitalize">
          {movie.status.replace(/_/g, " ").toLowerCase()}
        </div>
      )}

      <TrailerModal
        isOpen={showTrailer}
        movie={movie}
        onClose={() => setShowTrailer(false)}
      />
    </div>
  );
};
