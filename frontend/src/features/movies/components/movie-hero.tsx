import { formatImageUrl } from "@/helper/image-helper"
import { Movie } from "../types"
import { Play } from "lucide-react";

interface MovieHeroProps {
  movie: Movie;
  onPlayTrailer: () => void;
}

export const MovieHero = ({ movie, onPlayTrailer }: MovieHeroProps) => {
  return (
    <div className="relative w-full h-[480px] md:h-[560px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: movie.bannerUrl
            ? `url("${formatImageUrl(movie.bannerUrl)}")`
            : undefined,
          backgroundColor:
            !movie.bannerUrl && !movie.posterUrl ? "hsl(0,0%,12%)" : undefined,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-background/60 to-transparent" />

      {movie.trailerUrl && (
        <button
          onClick={onPlayTrailer}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className="w-16 h-16 rounded-full cinema-gradient cinema-glow flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </button>
      )}
    </div>
  )
}
