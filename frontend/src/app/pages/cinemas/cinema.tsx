import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Clock,
  CalendarDays,
  User,
  PenLine,
  ChevronLeft,
  Star,
  Ticket,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type MovieStatus = "NOW_SHOWING" | "COMING_SOON" | "END_OF_SHOW";

export type Genre = {
  id: string;
  name: string;
};

export type MovieSchedule = {
  id: string;
  date: string;
  time: string;
  studio: string;
  price: number;
  availableSeats: number;
};

export type Movie = {
  id: string;
  title: string;
  synopsis?: string;
  posterUrl?: string;
  bannerUrl?: string;
  duration: number;
  director?: string;
  writer?: string;
  isFeatured: boolean;
  status: MovieStatus;
  trailerUrl?: string;
  genres: Genre[];
  movieSchedules: MovieSchedule[];
  createdAt: Date;
  updatedAt: Date;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockMovie: Movie = {
  id: "1",
  title: "Dune: Part Two",
  synopsis:
    "Paul Atreides unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.",
  posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlDjQ3RAQ7mPnIt.jpg",
  bannerUrl:
    "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
  duration: 166,
  director: "Denis Villeneuve",
  writer: "Denis Villeneuve, Jon Spaihts",
  isFeatured: true,
  status: "NOW_SHOWING",
  trailerUrl: "https://youtube.com/watch?v=Way9Dexny3w",
  genres: [
    { id: "1", name: "Sci-Fi" },
    { id: "2", name: "Adventure" },
    { id: "3", name: "Drama" },
  ],
  movieSchedules: [
    {
      id: "s1",
      date: "2024-03-15",
      time: "10:00",
      studio: "Studio 1",
      price: 50000,
      availableSeats: 45,
    },
    {
      id: "s2",
      date: "2024-03-15",
      time: "13:30",
      studio: "Studio 2",
      price: 65000,
      availableSeats: 20,
    },
    {
      id: "s3",
      date: "2024-03-15",
      time: "16:45",
      studio: "Studio 1",
      price: 65000,
      availableSeats: 60,
    },
    {
      id: "s4",
      date: "2024-03-15",
      time: "20:00",
      studio: "Studio 3",
      price: 80000,
      availableSeats: 8,
    },
    {
      id: "s5",
      date: "2024-03-16",
      time: "11:00",
      studio: "Studio 2",
      price: 50000,
      availableSeats: 55,
    },
    {
      id: "s6",
      date: "2024-03-16",
      time: "19:30",
      studio: "Studio 1",
      price: 80000,
      availableSeats: 0,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function groupSchedulesByDate(schedules: MovieSchedule[]) {
  return schedules.reduce<Record<string, MovieSchedule[]>>((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});
}

function statusLabel(status: MovieStatus) {
  switch (status) {
    case "NOW_SHOWING":
      return "Now Showing";
    case "COMING_SOON":
      return "Coming Soon";
    case "END_OF_SHOW":
      return "End of Show";
  }
}

function statusColor(status: MovieStatus) {
  switch (status) {
    case "NOW_SHOWING":
      return "bg-primary/20 text-primary border-primary/40";
    case "COMING_SOON":
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case "END_OF_SHOW":
      return "bg-muted text-muted-foreground border-border";
  }
}

function seatColor(seats: number) {
  if (seats === 0) return "text-red-500";
  if (seats <= 15) return "text-amber-400";
  return "text-green-500";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ScheduleCard({
  schedule,
  canBook,
}: {
  schedule: MovieSchedule;
  canBook: boolean;
}) {
  const sold = schedule.availableSeats === 0;
  return (
    <button
      disabled={sold || !canBook}
      className={`group relative flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-all duration-200
        ${sold || !canBook
          ? "border-border/50 bg-muted/30 opacity-60 cursor-not-allowed"
          : "border-border bg-card hover:border-primary/60 hover:bg-accent/40 hover:shadow-[0_0_16px_hsla(0,84%,60%,0.15)] cursor-pointer"
        }`}
    >
      {!sold && canBook && (
        <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ring-1 ring-primary/30" />
      )}
      <span className="text-xl font-bold text-foreground tabular-nums">
        {schedule.time}
      </span>
      <span className="text-xs text-muted-foreground">{schedule.studio}</span>
      <Separator className="my-1 bg-border/50" />
      <span className="text-sm font-semibold text-primary">
        {formatPrice(schedule.price)}
      </span>
      <span className={`text-xs font-medium ${seatColor(schedule.availableSeats)}`}>
        {sold ? "Sold Out" : `${schedule.availableSeats} seats left`}
      </span>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MovieDetailPage({ movie = mockMovie }: { movie?: Movie }) {
  const grouped = groupSchedulesByDate(movie.movieSchedules);
  const canBook = movie.status === "NOW_SHOWING";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Banner ── */}
      <div className="relative w-full h-[55vh] min-h-[340px] overflow-hidden">
        {movie.bannerUrl ? (
          <img
            src={movie.bannerUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-top scale-105"
            style={{ filter: "brightness(0.45)" }}
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        {/* back button */}
        <div className="absolute top-6 left-0 right-0 layout-middle">
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Featured badge */}
        {movie.isFeatured && (
          <div className="absolute top-6 right-0 layout-middle flex justify-end">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold cinema-gradient text-white px-3 py-1.5 rounded-full">
              <Star className="w-3 h-3 fill-white" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="layout-middle -mt-40 relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 lg:w-56 hidden sm:block">
            <div className="rounded-2xl overflow-hidden cinema-border cinema-glow shadow-2xl">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No Poster</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 lg:pt-8">
            {/* Status + Genres */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor(movie.status)}`}
              >
                {statusLabel(movie.status)}
              </span>
              {movie.genres.map((g) => (
                <Badge
                  key={g.id}
                  variant="secondary"
                  className="text-xs rounded-full"
                >
                  {g.name}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1
              className="text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight mb-4"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
            >
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6">
              <MetaItem
                icon={<Clock className="w-4 h-4" />}
                label="Duration"
                value={formatDuration(movie.duration)}
              />
              {movie.director && (
                <MetaItem
                  icon={<User className="w-4 h-4" />}
                  label="Director"
                  value={movie.director}
                />
              )}
              {movie.writer && (
                <MetaItem
                  icon={<PenLine className="w-4 h-4" />}
                  label="Writer"
                  value={movie.writer}
                />
              )}
            </div>

            {/* Synopsis */}
            {movie.synopsis && (
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">
                {movie.synopsis}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              {movie.trailerUrl && (
                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-border hover:border-primary/60 hover:text-primary"
                  onClick={() => window.open(movie.trailerUrl, "_blank")}
                >
                  <Play className="w-4 h-4" />
                  Watch Trailer
                </Button>
              )}
              {canBook && movie.movieSchedules.length > 0 && (
                <Button className="gap-2 cinema-gradient rounded-full text-white border-0 cinema-glow hover:opacity-90 transition-opacity">
                  <Ticket className="w-4 h-4" />
                  Book Tickets
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── Schedules ── */}
        {movie.movieSchedules.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Showtimes</h2>
            </div>

            <div className="space-y-8">
              {Object.entries(grouped).map(([date, schedules]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-semibold text-foreground">
                      {formatDate(date)}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {schedules.map((s) => (
                      <ScheduleCard key={s.id} schedule={s} canBook={canBook} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {!canBook && (
              <p className="mt-6 text-sm text-muted-foreground italic">
                {movie.status === "COMING_SOON"
                  ? "Ticket booking will open when the movie starts showing."
                  : "This movie is no longer showing."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
