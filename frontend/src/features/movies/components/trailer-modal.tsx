import { Movie } from "@/lib/api";

interface TrailerModalProps {
  movie: Movie
  isOpen: boolean;
  onClose: () => void
}

export const TrailerModal = ({ isOpen, movie, onClose }: TrailerModalProps) => {
  return (
    <>
      {isOpen && movie.trailerUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div
            className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden cinema-border cinema-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={movie.trailerUrl.replace("watch?v=", "embed/")}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={`${movie.title} Trailer`}
            />
          </div>
        </div>
      )}
    </>
  )
}
