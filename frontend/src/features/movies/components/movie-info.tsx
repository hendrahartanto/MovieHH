import { formatImageUrl } from "@/helper/image-helper"
import { Movie } from "@/lib/api"
import { Clock, PenLine, Play, Star, User } from "lucide-react"
import moviePlaceHolder from "@/assets/movie-placeholder.jpg"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/helper/format-helper"

interface MovieInfoProps {
  movie: Movie
  onPlayTrailer: () => void;
}

export const MovieInfo = ({ movie, onPlayTrailer }: MovieInfoProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Poster */}
      <div className="shrink-0 w-44 md:w-56 mx-auto md:mx-0">
        <div className="cinema-border rounded-xl overflow-hidden shadow-2xl cinema-glow">
          {movie.posterUrl ? (
            <img
              src={formatImageUrl(movie.posterUrl) || moviePlaceHolder}
              alt={movie.title}
              className="w-full aspect-2/3 object-cover"
            />
          ) : (
            <div className="w-full aspect-2/3 bg-muted flex items-center justify-center">
              <Star className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 pt-4 md:pt-28">
        {movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genres.map((g) => (
              <Badge
                key={g.id}
                variant="outline"
                className="cinema-border text-primary text-xs"
              >
                {g.name}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
          {movie.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground text-sm mb-6">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            {formatDuration(movie.duration)}
          </span>
          {movie.director && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" />
              <span>
                <span className="text-muted-foreground/60 mr-1">Dir.</span>
                {movie.director}
              </span>
            </span>
          )}
          {movie.writer && (
            <span className="flex items-center gap-1.5">
              <PenLine className="w-4 h-4 text-primary" />
              <span>
                <span className="text-muted-foreground/60 mr-1">Writer</span>
                {movie.writer}
              </span>
            </span>
          )}
        </div>

        {movie.synopsis && (
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">
            {movie.synopsis}
          </p>
        )}

        <div className="flex gap-3 flex-wrap">
          {movie.trailerUrl && (
            <Button
              variant="outline"
              className="cinema-border hover:bg-accent gap-2"
              onClick={onPlayTrailer}
            >
              <Play className="w-4 h-4 fill-primary text-primary" />
              Watch Trailer
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
