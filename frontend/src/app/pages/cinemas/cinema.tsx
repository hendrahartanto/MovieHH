import { useParams } from "react-router";
import { CinemaInfo } from "@/features/movie-schedules/components/cinema-info";
import { CinemaInfoSkeleton } from "@/features/theaters/components/cinema-info-skeleton";
import { CinemaBookingSection } from "@/features/theaters/components/cinema-booking-section";
import { useTheater } from "@/features/theaters/api/get-theater";

const CinemaDetailPage = () => {
  const { theaterId } = useParams<{ theaterId: string }>();
  const { data: theaterData, isLoading: isTheaterLoading } = useTheater({
    theaterId: theaterId!,
  });

  const theater = theaterData?.data?.theater;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative w-full h-[280px] sm:h-80 overflow-hidden bg-card">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background z-10" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              hsla(0,84%,60%,0.15) 20px,
              hsla(0,84%,60%,0.15) 21px
            )`,
          }}
        />
        <div className="absolute inset-0 cinema-gradient opacity-20" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="content-wrapper -mt-32 relative z-20 pb-20">
        {isTheaterLoading || !theater ? (
          <CinemaInfoSkeleton />
        ) : (
          <CinemaInfo theater={theater} />
        )}
        <CinemaBookingSection theaterId={theaterId!} />
      </div>
    </div>
  );
};

export default CinemaDetailPage;
