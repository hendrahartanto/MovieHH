import { PrismaClient } from "@prisma/client";
import theaterService from "../src/apps/theater/domain/theater.service";
import showTimeService from "../src/apps/show-time/domain/show-time.service";
import { parse, addMinutes, format } from "date-fns";

const prisma = new PrismaClient();

async function seedGenres() {
  const genreNames = [
    "Action",
    "Comedy",
    "Drama",
    "Sci-Fi",
    "Horror",
    "Romance",
    "Thriller",
  ];

  const genres = [];
  for (const name of genreNames) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    genres.push(genre);
  }
  return genres;
}

async function seedMoviesWithGenres(genreMap: Record<string, string>) {
  const movies = [
    {
      title: "Avengers: Endgame",
      synopsis:
        "The Avengers assemble once more to reverse the destruction caused by Thanos.",
      posterUrl:
        "https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SL1500_.jpg",
      bannerUrl:
        "https://cdn.marvel.com/content/1x/avengersendgame_lob_crd_05.jpg",
      duration: 181,
      director: "Anthony Russo, Joe Russo",
      writer: "Christopher Markus, Stephen McFeely",
      isFeatured: true,
      status: "ACTIVE",
      genres: ["Action", "Sci-Fi", "Drama"],
      trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    },
    {
      title: "Interstellar",
      synopsis:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl:
        "https://m.media-amazon.com/images/I/71n58kS7iDL._AC_SL1188_.jpg",
      bannerUrl:
        "https://www.joblo.com/wp-content/uploads/2014/07/interstellar-banner-1.jpg",
      duration: 169,
      director: "Christopher Nolan",
      writer: "Jonathan Nolan, Christopher Nolan",
      isFeatured: true,
      status: "ACTIVE",
      genres: ["Sci-Fi", "Drama", "Thriller"],
      trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    },
    {
      title: "La La Land",
      synopsis:
        "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
      posterUrl:
        "https://m.media-amazon.com/images/I/71pD2T6QFiL._AC_SL1500_.jpg",
      bannerUrl: "https://i.ytimg.com/vi/0pdqf4P9MB8/maxresdefault.jpg",
      duration: 128,
      director: "Damien Chazelle",
      writer: "Damien Chazelle",
      isFeatured: false,
      status: "ACTIVE",
      genres: ["Romance", "Drama"],
      trailerUrl: "https://www.youtube.com/watch?v=0pdqf4P9MB8",
    },
  ];

  const createdMovies = [];
  for (const m of movies) {
    const movie = await prisma.movie.create({
      data: {
        title: m.title,
        synopsis: m.synopsis,
        posterUrl: m.posterUrl,
        bannerUrl: m.bannerUrl,
        duration: m.duration,
        director: m.director,
        writer: m.writer,
        isFeatured: m.isFeatured,
        status: m.status as any,
        trailerUrl: m.trailerUrl,
        genres: {
          create: m.genres.map((g) => ({
            genre: { connect: { id: genreMap[g] } },
          })),
        },
      },
    });
    createdMovies.push(movie);
  }

  return createdMovies;
}

async function seedLocationsAndTheaters() {
  const locations = [
    {
      name: "Pacific Place Mall",
      address: "Jl. Jend. Sudirman No.52-53, SCBD, Jakarta Selatan",
      theaters: ["CGV Pacific Place", "Cinépolis Pacific Place"],
    },
    {
      name: "Gandaria City Mall",
      address: "Jl. Sultan Iskandar Muda, Kebayoran Lama, Jakarta Selatan",
      theaters: ["XXI Gandaria City"],
    },
  ];

  const createdTheaters = [];
  for (const loc of locations) {
    const location = await prisma.location.upsert({
      where: { name: loc.name },
      update: {},
      create: {
        name: loc.name,
        address: loc.address,
      },
    });

    for (const t of loc.theaters) {
      const theater = await theaterService.createTheater({
        name: t,
        locationId: location.id,
      });
      createdTheaters.push(theater);
    }
  }

  return createdTheaters;
}

async function seedShowtimes(movies: any[], theaters: any[]) {
  const today = new Date();
  const bufferMinutes = 30;

  for (const theater of theaters) {
    let currentShowtimeStart = parse("09:00", "HH:mm", today);

    for (const movie of movies) {
      if (typeof movie.duration !== "number") {
        console.warn(
          `Skipping showtime for movie "${movie.title}" due to missing or invalid duration.`
        );
        continue;
      }

      const startTimeFormatted = format(currentShowtimeStart, "HH:mm");
      const endTime = addMinutes(currentShowtimeStart, movie.duration);
      const endTimeFormatted = format(endTime, "HH:mm");

      const movieSchedule = await showTimeService.createMovieSchedule({
        date: today,
        movieId: movie.id,
        price: 60000,
        theaterId: theater.id,
      });

      await showTimeService.createShowTime({
        movieScheduleId: movieSchedule.id,
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
      });

      currentShowtimeStart = addMinutes(endTime, bufferMinutes);
    }
  }
}

async function main() {
  console.log("🚀 Starting seeding...");

  // 1. Genres
  const genres = await seedGenres();
  const genreMap = Object.fromEntries(genres.map((g) => [g.name, g.id]));

  // 2. Movies
  const movies = await seedMoviesWithGenres(genreMap);

  // 3. Location & Theater
  const theaters = await seedLocationsAndTheaters();

  // 4. Showtimes
  await seedShowtimes(movies, theaters);

  console.log("✅ Seeding complete with", movies.length, "movies.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
